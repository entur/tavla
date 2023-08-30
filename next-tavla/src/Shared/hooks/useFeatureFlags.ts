import { useState, useEffect } from 'react'
import { Feature } from 'types/featureFlag'

export function useFeatureFlags(feature: Feature) {
    const [featureFlags, setFeatureFlags] = useState<string[]>()

    useEffect(() => {
        fetch('/api/featureFlags')
            .then((res) => res.json())
            .then((data) => setFeatureFlags(data as string[]))
    }, [])

    return featureFlags?.includes(feature) ?? false
}
