import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    if (!process.env.ENABLED_FEATURES) return response.status(500).json([])

    const enabledFeatures = JSON.parse(process.env.ENABLED_FEATURES)

    return response.status(200).json(enabledFeatures)
}
