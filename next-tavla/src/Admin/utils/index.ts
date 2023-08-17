import { CLIENT_NAME, GEOCODER_ENDPOINT } from 'assets/env'

type TPartialGeoResponse = {
    features: Array<{
        properties: {
            id?: string
            label?: string
        }
    }>
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
