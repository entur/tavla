import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { uniq } from 'lodash'
import { useRealtimePositionLineRefsQuery } from '../../../graphql-generated/vehicles-v1'
import { isNotNullOrUndefined } from '../../utils/typeguards'

interface UseRealtimePositionLineRefs {
    realtimePositionLineRefs: string[]
    loading: boolean
    error?: ApolloError
}

function useRealtimePositionLineRefs(): UseRealtimePositionLineRefs {
    const { data, loading, error } = useRealtimePositionLineRefsQuery({
        fetchPolicy: 'cache-and-network',
    })

    const realtimePositionLineRefs = useMemo(
        () =>
            uniq(
                data?.vehicles
                    ?.map((vehicle) => vehicle?.line?.lineRef)
                    .filter(isNotNullOrUndefined) ?? [],
            ),

        [data?.vehicles],
    )

    return {
        realtimePositionLineRefs,
        loading,
        error,
    }
}

export { useRealtimePositionLineRefs }
