import { useEffect, useState } from 'react'
import { CLIENT_NAME, GRAPHQL_ENDPOINTS } from 'src/assets/env'
import { QuayEditQuery, StopPlaceEditQuery } from 'src/graphql/index'
import { BoardTileDB } from 'src/types/db-types/boards'
import { TQuay } from 'src/types/graphql-schema'
import { TLineFragment } from './types'

function useLines(tile: BoardTileDB): TLineFragment[] | null {
    const [lines, setLines] = useState(null)

    useEffect(() => {
        fetch(GRAPHQL_ENDPOINTS['journey-planner'], {
            headers: {
                'Content-Type': 'application/json',
                'ET-Client-Name': CLIENT_NAME,
            },
            body: JSON.stringify({
                query:
                    tile.type === 'quay' ? QuayEditQuery : StopPlaceEditQuery,
                variables: { placeId: tile.placeId },
            }),
            method: 'POST',
        })
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                if (tile.type === 'quay') setLines(res.data?.quay?.lines ?? [])
                else
                    setLines(
                        res.data?.stopPlace?.quays?.flatMap(
                            (q: TQuay) => q?.lines,
                        ) || [],
                    )
            })
    }, [tile])
    return lines
}

export { useLines }
