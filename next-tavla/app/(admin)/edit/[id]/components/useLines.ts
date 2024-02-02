import { TLineFragment } from 'Admin/scenarios/Edit/components/SelectLines/types'
import { GRAPHQL_ENDPOINTS } from 'assets/env'
import { QuayEditQuery, StopPlaceEditQuery } from 'graphql/index'
import { useEffect, useState } from 'react'
import { TQuay } from 'types/graphql-schema'
import { fieldsNotNull } from 'utils/typeguards'

function useLines(
    tileType: 'quay' | 'stop_place',
    placeId: string,
): TLineFragment {
    const [lines, setLines] = useState(null)

    useEffect(() => {
        fetch(GRAPHQL_ENDPOINTS['journey-planner'], {
            headers: {
                'Content-Type': 'application/json',
                'ET-Client-Name': 'tavla-test',
            },
            body: JSON.stringify({
                query: tileType === 'quay' ? QuayEditQuery : StopPlaceEditQuery,
                variables: { placeId },
            }),
            method: 'POST',
        })
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                if (tileType === 'quay')
                    setLines(res.data?.quay?.lines.filter(fieldsNotNull) ?? [])
                setLines(
                    res.data?.stopPlace?.quays
                        ?.flatMap((q: TQuay) => q?.lines)
                        .filter(fieldsNotNull) || [],
                )
            })
    }, [tileType])
    return lines
}

export { useLines }
