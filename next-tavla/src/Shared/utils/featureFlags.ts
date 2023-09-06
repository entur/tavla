import { Feature } from 'types/featureFlag'

export function checkFeatureFlags(feature: Feature) {
    if (!process.env.NEXT_PUBLIC_ENABLED_FEATURES) return false
    const enabledFeatures = JSON.parse(process.env.NEXT_PUBLIC_ENABLED_FEATURES)

    return enabledFeatures.includes(feature)
}
