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

export type GeoCoordinate = {
    lat: number
    lon: number
}

/**
 * Geocoder v3 returns a GeoJSON FeatureCollection with structured `properties`
 * (see the v2→v3 migration guide). We normalise it back to the flat shape the
 * rest of the app consumes via `normalizeLayer` / `normalizeCategory` below.
 */
type TGeoLayer =
    | 'address'
    | 'street'
    | 'stopPlace'
    | 'groupOfStopPlaces'
    | 'poi'
    | 'place'

type TGeoFeature = {
    properties: {
        id?: string
        names?: {
            default?: string
            display?: string
        }
        layer?: TGeoLayer
        address?: {
            county?: string
        }
        stopPlaceTypes?: TCategory[]
    }
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

// v3 renamed the stop-place layer from v1's 'venue' to 'stopPlace'. The rest of
// the app (getIcons, getTypeOfPlace) still speaks the 'venue' vocabulary.
function normalizeLayer(layer?: TGeoLayer): string | undefined {
    return layer === 'stopPlace' ? 'venue' : layer
}

// v3 split v1's flat `category` into `stopPlaceTypes` (NeTEx types for stops)
// and `categories` (OSM tags). Stops keep their NeTEx types; addresses keep the
// 'vegadresse' marker v1 used to pick the address icon and place type.
function normalizeCategory(
    properties: TGeoFeature['properties'],
): TCategory[] | undefined {
    if (properties.stopPlaceTypes && properties.stopPlaceTypes.length > 0)
        return properties.stopPlaceTypes
    if (properties.layer === 'address' || properties.layer === 'street')
        return ['vegadresse']
    if (properties.layer === 'stopPlace') return undefined
    // poi / place / groupOfStopPlaces — non-stop, non-address results render
    // the generic location pin (v1 returned a 'poi'-style category here).
    return ['poi']
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
        layers: 'stopPlace,address',
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
