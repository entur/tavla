export const features = ['FEATURE_LOGIN'] as const

export type Feature = (typeof features)[number]

export const undefinedFeatureFlags: Record<Feature, boolean | undefined> =
    features.reduce((acc, feature) => {
        acc[feature] = undefined
        return acc
    }, {} as Record<Feature, boolean | undefined>)
