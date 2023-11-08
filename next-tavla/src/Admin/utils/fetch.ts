import { NormalizedDropdownItemType } from '@entur/dropdown'
import { TavlaError } from 'Admin/types/error'
import { CLIENT_NAME, COUNTY_ENDPOINT, GEOCODER_ENDPOINT } from 'assets/env'
import { TBoardID, TOrganization } from 'types/settings'

type TPartialGeoResponse = {
    features: Array<{
        properties: {
            id?: string
            label?: string
        }
    }>
}

type TCounty = {
    fylkesnavn: string
    fylkesnummer: string
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
            }))
        })
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

export async function fetchWithIdToken(
    url: string,
    idToken: string,
    method = 'POST',
) {
    return fetch(url, {
        method,
        headers: { Authorization: `Bearer ${idToken}` },
    })
}

export async function fetchDeleteBoard(bid: TBoardID) {
    const response = await fetch('/api/board', {
        method: 'DELETE',
        body: JSON.stringify({ bid: bid }),
    })

    if (!response.ok) {
        throw new TavlaError({
            code: 'BOARD',
            message: 'Could not delete board',
        })
    }
}

export async function createOrganizationRequest(name: string) {
    const response = await fetch('/api/organization', {
        method: 'POST',
        body: JSON.stringify({ name: name }),
    })
    if (!response.ok) {
        throw new TavlaError({
            code: 'ORGANIZATION',
            message: 'Could not create organization',
        })
    }
    return response
}

export async function getOrganizationsForUserRequest(): Promise<
    NormalizedDropdownItemType[]
> {
    const response = await fetch('/api/organization', { method: 'GET' })
    if (!response.ok) {
        throw new TavlaError({
            code: 'ORGANIZATION',
            message: 'Could not get organizations',
        })
    }
    return response.json().then((data) => {
        return data.organizations.map((org: TOrganization) => ({
            value: org.id,
            label: org.name,
        }))
    })
}
