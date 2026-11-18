import { useEffect, useState } from 'react'
import { StopPlaceEditQuery } from 'src/graphql'
import { fetchQuery } from 'src/graphql/utils'
import type { TStopPlaceEditQuery } from 'src/types/operations'

type TStopPlaceEditResult = NonNullable<TStopPlaceEditQuery['stopPlace']>
type TStopPlaceEditQuays = NonNullable<TStopPlaceEditResult['quays']>
export type TQuay = NonNullable<TStopPlaceEditQuays[number]>

function useStopPlaceLines(stopPlaceId: string): TQuay[] | null {
    const [quays, setQuays] = useState<TQuay[] | null>(null)

    useEffect(() => {
        async function fetchData() {
            const response = await fetchQuery(StopPlaceEditQuery, {
                placeId: stopPlaceId,
            })
            setQuays(
                (response.stopPlace?.quays ?? []).filter(
                    (quay): quay is TQuay => quay !== null,
                ),
            )
        }

        fetchData().catch(() => setQuays([]))
    }, [stopPlaceId])

    return quays
}

export { useStopPlaceLines }
