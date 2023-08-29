import { Feature, undefinedFeatureFlags } from 'types/featureFlag'
import { useState, useEffect } from 'react'

export function useFeatureFlags() {
    const [featureFlags, setFeatureFlags] = useState<
        Record<Feature, boolean | undefined>
    >(undefinedFeatureFlags)

    useEffect(() => {
        async function fetchFlags() {
            await fetch('/api/featureFlags')
                .then(
                    (res) =>
                        res.json() as Promise<
                            Record<Feature, boolean | undefined>
                        >,
                )
                .then((data) => setFeatureFlags(data))
        }

        fetchFlags()
    }, [])

    return featureFlags
}
