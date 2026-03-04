import { useEffect, useState } from 'react'
import { CLIENT_NAME, GRAPHQL_ENDPOINTS } from 'src/assets/env'
import { StopPlaceEditQuery } from 'src/graphql/index'
import { BoardTileDB } from 'src/types/db-types/boards'
import { TQuay } from 'src/types/graphql-schema'

function useLines(tile: BoardTileDB): TQuay[] | null {
    const [quays, setQuays] = useState<TQuay[] | null>(null)

    useEffect(() => {
        fetch(GRAPHQL_ENDPOINTS['journey-planner'], {
            headers: {
                'Content-Type': 'application/json',
                'ET-Client-Name': CLIENT_NAME,
            },
            body: JSON.stringify({
                query: StopPlaceEditQuery,
                variables: { placeId: tile.stopPlaceId },
            }),
            method: 'POST',
        })
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                setQuays(res.data?.stopPlace?.quays ?? [])
            })
    }, [tile])
    return quays
}

export { useLines }
