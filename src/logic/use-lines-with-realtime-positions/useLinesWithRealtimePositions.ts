import { useMemo } from 'react'
import { useUseLinesWithRealtimePositionsQuery } from '../../../graphql-generated/vehicles-v1'
import { isNotNullOrUndefined } from '../../utils/typeguards'

function useLinesWithRealtimePositions() {
    const { data } = useUseLinesWithRealtimePositionsQuery({
        fetchPolicy: 'cache-and-network',
    })

    return useMemo(
        () => [
            ...new Set(
                data?.vehicles
                    ?.map((vehicle) => vehicle?.line?.lineRef ?? null)
                    .filter(isNotNullOrUndefined) ?? [],
            ),
        ],
        [data],
    )
}

export { useLinesWithRealtimePositions }
