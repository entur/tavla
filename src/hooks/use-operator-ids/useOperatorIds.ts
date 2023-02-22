import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { useOperatorIdsQuery } from 'graphql-generated/mobility-v2'
import { isNotNullOrUndefined } from 'utils/typeguards'

function useOperatorIds(): {
    operatorIds: string[]
    loading: boolean
    error?: ApolloError
} {
    const { data, loading, error } = useOperatorIdsQuery({
        fetchPolicy: 'cache-and-network',
    })

    const operatorIds = useMemo(
        () =>
            data?.operators
                ?.filter(isNotNullOrUndefined)
                .map((operator) => operator.id) ?? [],
        [data?.operators],
    )

    return {
        operatorIds,
        loading,
        error,
    }
}

export { useOperatorIds }
