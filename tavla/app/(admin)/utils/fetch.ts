import { NormalizedDropdownItemType } from '@entur/dropdown'
import { uniq } from 'lodash'
import {
    CLIENT_NAME,
    COUNTY_ENDPOINT,
    GEOCODER_ENDPOINT,
    GRAPHQL_ENDPOINTS,
} from 'src/assets/env'
import { StopPlacesHaveDeparturesQuery } from 'src/graphql'
import { LocationDB } from 'src/types/db-types/boards'
import { TCategory, getIcons } from '../tavler/[id]/utils'

export type GeoCoordinate = {
    lat: number
    lon: number
}

type TPartialGeoResponse = {
    features: Array<{
        properties: {
            id?: string
            label?: string
            layer?: string
            category?: [TCategory]
            county?: string
            name?: string
        }
        geometry: {
            coordinates: [number, number]
        }
    }>
}

function toGeoCoordinate(coordinates: [number, number]): GeoCoordinate {
    return { lon: coordinates[0], lat: coordinates[1] }
}

export type StopPlace = {
    id: string
    county?: string
    category?: [TCategory]
    coordinates?: GeoCoordinate
    layer?: string
    name?: string
}

type TPointGeoresponse = {
    features: Array<{
        properties: {
            id?: string
            label?: string
            layer?: string
            category?: [TCategory]
        }
        geometry: {
            coordinates: [number, number]
        }
    }>
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

async function fetchStopPlaceIdsWithDepartures(
    ids: string[],
): Promise<Set<string>> {
    if (ids.length === 0) return new Set()

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
    const stopPlaces = json.data?.stopPlaces ?? []

    return new Set(
        stopPlaces
            .filter(
                (sp: { id: string; estimatedCalls: unknown[] } | null) =>
                    sp && sp.estimatedCalls.length > 0,
            )
            .map((sp: { id: string }) => sp.id),
    )
}

export async function fetchStopPlaces(
    text: string,
    countyIds?: string[],
): Promise<NormalizedDropdownItemType<StopPlace>[]> {
    if (!text) return []

    const searchParams = new URLSearchParams({
        lang: 'no',
        size: '10',
        layers: 'venue,address',
        text,
    })

    if (countyIds && countyIds.length > 0)
        searchParams.append('boundary.county_ids', countyIds.join(','))

    const data: TPartialGeoResponse = await fetch(
        `${GEOCODER_ENDPOINT}/autocomplete?${searchParams}`,
        {
            headers: {
                'ET-Client-Name': CLIENT_NAME,
            },
        },
    ).then((res) => res.json())

    const items = data.features.map(({ properties, geometry }) => ({
        value: {
            id: properties.id ?? '',
            county: properties.county,
            category: properties.category,
            coordinates: toGeoCoordinate(geometry.coordinates),
            layer: properties.layer,
        },
        label: properties.label || '',
        icons: uniq(getIcons(properties.layer, properties.category)),
        county: properties.county,
        itemKey: properties.id ?? properties.label ?? '',
    }))

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
        .slice(0, 5)
}

export async function fetchClosestStopPlaces(
    coordinates: GeoCoordinate,
    numberOfStopPlaces: number,
    areaRadiusInKm: number = 1,
): Promise<NormalizedDropdownItemType<StopPlace>[]> {
    const requestSize = numberOfStopPlaces * 2

    const data: TPartialGeoResponse = await fetch(
        `${GEOCODER_ENDPOINT}/reverse?point.lat=${coordinates.lat}&point.lon=${coordinates.lon}&boundary.circle.radius=${areaRadiusInKm}&layers=venue&size=${requestSize}`,
        {
            headers: {
                'ET-Client-Name': CLIENT_NAME,
            },
        },
    ).then((res) => res.json())

    const items = data.features.map(({ properties, geometry }) => ({
        value: {
            id: properties.id ?? '',
            county: properties.county,
            coordinates: toGeoCoordinate(geometry.coordinates),
            name: properties.name ?? '',
        },
        label: properties.label || '',
        icons: uniq(getIcons(properties.layer, properties.category)),
        county: properties.county,
    }))

    const venueIds = items
        .filter((item) => item.value.id)
        .map((item) => item.value.id)

    const idsWithDepartures = await fetchStopPlaceIdsWithDepartures(venueIds)

    return items
        .filter((item) => idsWithDepartures.has(item.value.id))
        .slice(0, numberOfStopPlaces)
}

export async function fetchPoints(
    text: string,
): Promise<NormalizedDropdownItemType<LocationDB>[]> {
    if (!text || text.length < 3) return []

    const searchParams = new URLSearchParams({
        lang: 'no',
        size: '5',
        text,
    })

    return fetch(`${GEOCODER_ENDPOINT}/autocomplete?${searchParams}`, {
        headers: {
            'ET-Client-Name': CLIENT_NAME,
        },
    })
        .then((res) => res.json())
        .then((data: TPointGeoresponse) => {
            return data.features.map(({ properties, geometry }) => ({
                value: {
                    name: properties.label ?? '',
                    coordinate: {
                        lat: geometry.coordinates[1],
                        lng: geometry.coordinates[0],
                    },
                },
                label: properties.label || '',
                icons: getIcons(properties.layer, properties.category),
            }))
        })
}
