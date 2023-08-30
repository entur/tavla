import { Feature } from 'types/featureFlag'
import fetch from 'node-fetch'

export async function checkFeatureFlags(feature: Feature): Promise<boolean> {
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_DOMAIN
            : 'http://localhost:3000'
    const response = await fetch(baseUrl + '/api/featureFlags')
    const data = (await response.json()) as string[]
    return data.includes(feature)
}
