import { useState, useEffect } from 'react'
import { Feature } from 'types/featureFlag'

export function useFeatureFlags(feature: Feature) {
    const [featureFlags, setFeatureFlags] = useState<string[]>()

    useEffect(() => {
        async function fetchFlags() {
            await fetch('/api/featureFlags')
                .then((res) => res.json())
                .then((data) => setFeatureFlags(data as string[]))
        }

        fetchFlags()
    }, [])

    return featureFlags?.includes(feature) ?? false
}
