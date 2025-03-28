import { COUNTY_ENDPOINT, GEOCODER_ENDPOINT, CLIENT_NAME } from 'assets/env'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { TCategory, getIcons } from '../tavler/[id]/rediger/utils'
import { TLocation } from 'types/meta'
import { uniq } from 'lodash'

type TPartialGeoResponse = {
    features: Array<{
        properties: {
            id?: string
            label?: string
            layer?: string
            category?: [TCategory]
        }
    }>
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
): Promise<NormalizedDropdownItemType[]> {
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
                value: properties.id ?? '',
                label: properties.label || '',
                icons: uniq(getIcons(properties.layer, properties.category)),
            }))
        })
}

export async function fetchPoints(
    text: string,
): Promise<NormalizedDropdownItemType<TLocation>[]> {
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
