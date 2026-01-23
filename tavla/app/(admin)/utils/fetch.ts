import { NormalizedDropdownItemType } from '@entur/dropdown'
import { uniq } from 'lodash'
import { CLIENT_NAME, COUNTY_ENDPOINT, GEOCODER_ENDPOINT } from 'src/assets/env'
import { LocationDB } from 'src/types/db-types/boards'
import { TCategory, getIcons } from '../tavler/[id]/utils'

type TPartialGeoResponse = {
    features: Array<{
        properties: {
            id?: string
            label?: string
            layer?: string
            category?: [TCategory]
            county?: string
        }
    }>
}

export type stopPlace = {
    id: string
    county?: string
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

export async function fetchStopPlaces(
    text: string,
    countyIds?: string[],
): Promise<NormalizedDropdownItemType<stopPlace>[]> {
    if (!text || text.length < 3) return []

    const searchParams = new URLSearchParams({
        lang: 'no',
        size: '5',
        layers: 'venue',
        text,
    })

    if (countyIds && countyIds.length > 0)
        searchParams.append('boundary.county_ids', countyIds.join(','))

    return fetch(`${GEOCODER_ENDPOINT}/autocomplete?${searchParams}`, {
        headers: {
            'ET-Client-Name': CLIENT_NAME,
        },
    })
        .then((res) => res.json())
        .then((data: TPartialGeoResponse) => {
            return data.features.map(({ properties }) => ({
                value: {
                    id: properties.id ?? '',
                    county: properties.county,
                },
                label: properties.label || '',
                icons: uniq(getIcons(properties.layer, properties.category)),
                county: properties.county,
            }))
        })
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
