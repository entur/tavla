import type { NormalizedDropdownItemType } from '@entur/dropdown'
import { uniq, uniqBy } from 'lodash'
import {
    CLIENT_NAME,
    COUNTY_ENDPOINT,
    GEOCODER_ENDPOINT,
    GRAPHQL_ENDPOINTS,
} from 'src/assets/env'
import { StopPlacesHaveDeparturesQuery } from 'src/graphql'
import type { LocationDB } from 'src/types/db-types/boards'
import type {
    TTransportMode,
    TTransportSubmode,
} from 'src/types/graphql-schema'
import type { TStopPlacesHaveDeparturesQuery } from 'types/operations'
import { getRelevantSubmode } from 'utils/transport'
import { hasField, isNotNullOrUndefined } from 'utils/typeguards'
import {
    getIcons,
    type TCategory,
    travelTagsFromModes,
} from '../tavler/[id]/utils'
import {
    normalizeCategory,
    normalizeLayer,
    type TGeoProperties,
} from './geocoder'

export type GeoCoordinate = {
    lat: number
    lon: number
}

// Geocoder v3 returns a GeoJSON FeatureCollection. `properties` is normalised
// back to the flat shape the rest of the app consumes via the helpers in
// `./geocoder`.
type TGeoFeature = {
    properties: TGeoProperties
    geometry: {
        coordinates: [number, number]
    }
}

// `features` is optional on purpose: a v3 error response is HTTP 4xx with an
// `application/problem+json` body that has no `features`, so the field can be
// absent at runtime. Callers must default to `[]` before mapping.
type TGeoResponse = {
    features?: TGeoFeature[]
}

function toGeoCoordinate(coordinates: [number, number]): GeoCoordinate {
    return { lon: coordinates[0], lat: coordinates[1] }
}

export type StopPlace = {
    id: string
    county?: string
    category?: TCategory[]
    coordinates?: GeoCoordinate
    layer?: string
    name?: string
}

type TCounty = {
    fylkesnavn: string
    fylkesnummer: string
}

export async function fetchCounties(): Promise<NormalizedDropdownItemType[]> {
    return fetch(COUNTY_ENDPOINT)
        .then((res) => res.json())
        .then((counties: TCounty[]) => {
            return counties.map((county: TCounty) => ({
                value: county.fylkesnummer,
                label: county.fylkesnavn,
            }))
        })
}

type StopPlaceTransportModes = Array<{
    transportMode: TTransportMode
    transportSubmode?: TTransportSubmode
}>

async function fetchStopPlaceIdsWithDepartures(
    ids: string[],
): Promise<Map<string, StopPlaceTransportModes>> {
    if (ids.length === 0) return new Map()

    const response = await fetch(GRAPHQL_ENDPOINTS['journey-planner'], {
        headers: {
            'Content-Type': 'application/json',
            'ET-Client-Name': CLIENT_NAME,
        },
        body: JSON.stringify({
            query: StopPlacesHaveDeparturesQuery.toString(),
            variables: { ids },
        }),
        method: 'POST',
    })

    const json = await response.json()

    const stopPlaces: TStopPlacesHaveDeparturesQuery['stopPlaces'] =
        json.data.stopPlaces ?? []

    const map = new Map<string, StopPlaceTransportModes>()
    for (const stopPlace of stopPlaces) {
        if (!stopPlace) continue

        const allLines =
            stopPlace.quays
                ?.flatMap((quay) => quay?.lines)
                .filter((lines) => isNotNullOrUndefined(lines)) ?? []
        const allModes = allLines
            .filter((line) => hasField(line, 'transportMode'))
            .map((line) => ({
                transportMode: line.transportMode,
                transportSubmode: getRelevantSubmode(
                    line.transportSubmode ?? undefined,
                ),
            }))
        const uniqueModes = uniqBy(
            allModes,
            (modes) => `${modes.transportMode}|${modes.transportSubmode ?? ''}`,
        )
        map.set(stopPlace.id, uniqueModes)
    }
    return map
}

export async function fetchStopPlaces(
    text: string,
    countyIds?: string[],
): Promise<NormalizedDropdownItemType<StopPlace>[]> {
    if (!text) return []

    const searchParams = new URLSearchParams({
        lang: 'no',
        limit: '10',
        // v1's broad `address` layer became several layers in v3. Request all of
        // them so the field keeps returning addresses, streets, POIs and groups
        // of stop places alongside stop places, like v1's `venue,address` did.
        layers: 'stopPlace,groupOfStopPlaces,address,street,poi',
        q: text,
    })

    if (countyIds && countyIds.length > 0)
        searchParams.append(
            'counties',
            countyIds.map((id) => `KVE:TopographicPlace:${id}`).join(','),
        )

    const data: TGeoResponse = await fetch(
        `${GEOCODER_ENDPOINT}/autocomplete?${searchParams}`,
        {
            headers: {
                'ET-Client-Name': CLIENT_NAME,
            },
        },
    ).then((res) => res.json())

    const items = (data.features ?? []).map(({ properties, geometry }) => {
        const layer = normalizeLayer(properties.layer)
        const category = normalizeCategory(properties)
        const county = properties.address?.county
        const label = properties.names?.display ?? ''
        return {
            value: {
                id: properties.id ?? '',
                county,
                category,
                coordinates: toGeoCoordinate(geometry.coordinates),
                layer,
            },
            label,
            icons: uniq(getIcons(layer, category)),
            county,
            itemKey: properties.id ?? label,
        }
    })

    const venueIds = items
        .filter((item) => item.value.layer === 'venue' && item.value.id)
        .map((item) => item.value.id)

    const idsWithDepartures = await fetchStopPlaceIdsWithDepartures(venueIds)

    return items
        .filter(
            (item) =>
                item.value.layer !== 'venue' ||
                idsWithDepartures.has(item.value.id),
        )
        .map((item) => ({
            ...item,
            icons: idsWithDepartures.has(item.value.id)
                ? travelTagsFromModes(
                      idsWithDepartures.get(item.value.id) ?? [],
                  )
                : item.icons,
        }))
        .slice(0, 5)
}

export async function fetchClosestStopPlaces(
    coordinates: GeoCoordinate,
    numberOfStopPlaces: number,
    areaRadiusInKm: number = 1,
): Promise<NormalizedDropdownItemType<StopPlace>[]> {
    const requestSize = numberOfStopPlaces * 2

    const data: TGeoResponse = await fetch(
        `${GEOCODER_ENDPOINT}/reverse?lat=${coordinates.lat}&lon=${coordinates.lon}&radius=${areaRadiusInKm}&layers=stopPlace&limit=${requestSize}`,
        {
            headers: {
                'ET-Client-Name': CLIENT_NAME,
            },
        },
    ).then((res) => res.json())

    const items = (data.features ?? []).map(({ properties, geometry }) => {
        const county = properties.address?.county
        return {
            value: {
                id: properties.id ?? '',
                county,
                coordinates: toGeoCoordinate(geometry.coordinates),
                name: properties.names?.default ?? '',
            },
            label: properties.names?.display ?? '',
            county,
        }
    })

    const venueIds = items
        .filter((item) => item.value.id)
        .map((item) => item.value.id)

    const idsWithDepartures = await fetchStopPlaceIdsWithDepartures(venueIds)

    return items
        .filter((item) => idsWithDepartures.has(item.value.id))
        .map((item) => ({
            ...item,
            icons: travelTagsFromModes(
                idsWithDepartures.get(item.value.id) ?? [],
            ),
        }))
        .slice(0, numberOfStopPlaces)
}

export async function fetchPoints(
    text: string,
): Promise<NormalizedDropdownItemType<LocationDB>[]> {
    if (!text || text.length < 3) return []

    const searchParams = new URLSearchParams({
        lang: 'no',
        limit: '5',
        q: text,
    })

    return fetch(`${GEOCODER_ENDPOINT}/autocomplete?${searchParams}`, {
        headers: {
            'ET-Client-Name': CLIENT_NAME,
        },
    })
        .then((res) => res.json())
        .then((data: TGeoResponse) => {
            return (data.features ?? []).map(({ properties, geometry }) => {
                const label = properties.names?.display ?? ''
                return {
                    value: {
                        name: label,
                        coordinate: {
                            lat: geometry.coordinates[1],
                            lng: geometry.coordinates[0],
                        },
                    },
                    label,
                    icons: getIcons(
                        normalizeLayer(properties.layer),
                        normalizeCategory(properties),
                    ),
                }
            })
        })
}
