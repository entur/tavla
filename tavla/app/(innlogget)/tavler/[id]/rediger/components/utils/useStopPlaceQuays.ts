import { useEffect, useState } from 'react'
import { StopPlaceEditQuery } from 'src/graphql'
import { fetchQuery } from 'src/graphql/utils'
import type { TQuayFragment } from 'src/types/operations'

function useStopPlaceQuays(stopPlaceId: string): TQuayFragment[] | null {
    const [quays, setQuays] = useState<TQuayFragment[] | null>(null)

    useEffect(() => {
        async function fetchData() {
            const response = await fetchQuery(StopPlaceEditQuery, {
                placeId: stopPlaceId,
            })
            setQuays(
                (response.stopPlace?.quays ?? []).filter(
                    (quay): quay is TQuayFragment => quay !== null,
                ),
            )
        }

        fetchData().catch(() => setQuays([]))
    }, [stopPlaceId])

    return quays
}

export { useStopPlaceQuays }
