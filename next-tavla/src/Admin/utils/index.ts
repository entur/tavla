import { TavlaError } from 'Admin/types/error'
import { CLIENT_NAME, GEOCODER_ENDPOINT } from 'assets/env'
import { NextApiRequest } from 'next'
import { TTransportMode } from 'types/graphql-schema'

type TPartialGeoResponse = {
    features: Array<{
        properties: {
            id?: string
            label?: string
        }
    }>
}

export async function getBearerTokenFromRequest(request: NextApiRequest) {
    const authorization = request?.headers?.authorization
    if (!authorization)
        throw new TavlaError({
            code: 'AUTHORIZATION',
            message: 'Authorization header missing.',
        })
    if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1]
        if (!idToken)
            throw new TavlaError({
                code: 'AUTHORIZATION',
                message: 'Bearer token missing.',
            })
        return idToken
    } else
        throw new TavlaError({
            code: 'AUTHORIZATION',
            message: 'Bearer token was ill formatted.',
        })
}

export async function fetchItems(
    text: string,
): Promise<Array<{ value?: string; label: string }>> {
    if (!text || text.length < 3) return []

    const searchParams = new URLSearchParams({
        lang: 'no',
        size: '5',
        layers: 'venue',
        text,
    })

    return fetch(`${GEOCODER_ENDPOINT}/autocomplete?${searchParams}`, {
        headers: {
            'ET-Client-Name': CLIENT_NAME,
        },
    })
        .then((res) => res.json())
        .then((data: TPartialGeoResponse) => {
            const features = data['features']
            const items = features.map(({ properties }) => ({
                value: properties.id,
                label: properties.label || '',
            }))

            return items
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

export const transportModeNames: Record<TTransportMode, string> = {
    air: 'Fly',
    bus: 'Buss',
    cableway: 'Taubane',
    water: 'Båt',
    funicular: 'Kabelbane',
    lift: 'Heis',
    rail: 'Tog',
    metro: 'T-bane',
    tram: 'Trikk',
    trolleybus: 'Trolley-buss',
    monorail: 'Énskinnebane',
    coach: 'Langdistansebuss',
    unknown: 'Ukjent',
}
