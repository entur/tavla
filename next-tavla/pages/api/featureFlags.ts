import { NextApiRequest, NextApiResponse } from 'next'
import { undefinedFeatureFlags } from 'types/featureFlag'
import { stringToBoolean } from 'utils/converters'
import { isFeature } from 'utils/typeguards'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const featureFlags = undefinedFeatureFlags

    for (const [key, value] of Object.entries(process.env)) {
        if (key.startsWith('FEATURE_')) {
            if (isFeature(key)) {
                featureFlags[key] = stringToBoolean(value)
            } else {
                console.warn(
                    `Environment variable "${key}" does not match any feature flags defined in this project.`,
                )
            }
        }
    }

    for (const [key, value] of Object.entries(featureFlags)) {
        if (value === undefined) {
            console.warn(
                `Feature flag "${key}" is not defined, or set to a non-boolean value.`,
            )
        }
    }

    return response.status(200).json(featureFlags)
}
