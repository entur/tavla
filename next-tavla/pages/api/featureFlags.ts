import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const enabledFeatures = process.env.ENABLED_FEATURES
        ? JSON.parse(process.env.ENABLED_FEATURES)
        : []

    return response.status(200).json(enabledFeatures)
}
