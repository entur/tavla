import { TLineFragment } from 'Admin/scenarios/Edit/components/SelectLines/types'
import { GRAPHQL_ENDPOINTS } from 'assets/env'
import { QuayEditQuery, StopPlaceEditQuery } from 'graphql/index'
import { useEffect, useState } from 'react'
import { TQuay } from 'types/graphql-schema'
import { TTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'

function useLines(tile: TTile): TLineFragment[] | null {
    const [lines, setLines] = useState(null)

    useEffect(() => {
        fetch(GRAPHQL_ENDPOINTS['journey-planner'], {
            headers: {
                'Content-Type': 'application/json',
                'ET-Client-Name': 'tavla-test',
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
                if (tile.type === 'quay')
                    setLines(res.data?.quay?.lines.filter(fieldsNotNull) ?? [])
                setLines(
                    res.data?.stopPlace?.quays
                        ?.flatMap((q: TQuay) => q?.lines)
                        .filter(fieldsNotNull) || [],
                )
            })
    }, [tile])
    return lines
}

export { useLines }
