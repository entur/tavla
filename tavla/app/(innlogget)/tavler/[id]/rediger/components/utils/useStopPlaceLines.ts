import { useEffect, useState } from 'react'
import { CLIENT_NAME, GRAPHQL_ENDPOINTS } from 'src/assets/env'
import { StopPlaceEditQuery } from 'src/graphql'
import type { TQuay } from 'src/types/graphql-schema'

function useStopPlaceLines(stopPlaceId: string): TQuay[] | null {
    const [quays, setQuays] = useState<TQuay[] | null>(null)

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(GRAPHQL_ENDPOINTS['journey-planner'], {
                headers: {
                    'Content-Type': 'application/json',
                    'ET-Client-Name': CLIENT_NAME,
                },
                body: JSON.stringify({
                    query: StopPlaceEditQuery,
                    variables: { placeId: stopPlaceId },
                }),
                method: 'POST',
            })
            const json = await res.json()
            setQuays(json.data?.stopPlace?.quays ?? [])
        }

        fetchData().catch(() => setQuays([]))
    }, [stopPlaceId])

    return quays
}

export { useStopPlaceLines }
