import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { useStopPlaceWithDeparturesQuery } from '../../../graphql-generated/journey-planner-v3'
import { REFRESH_INTERVAL } from '../../constants'
import {
    StopPlaceWithEstimatedCalls,
    toStopPlaceWithEstimatedCalls,
} from './types'

interface UseStopPlacesWithEstimatedCalls {
    stopPlaceWithEstimatedCalls: StopPlaceWithEstimatedCalls | null
    loading: boolean
    error: ApolloError | undefined
}

function useStopPlaceWithEstimatedCalls(
    stopPlaceId: string,
): UseStopPlacesWithEstimatedCalls {
    const { data, loading, error } = useStopPlaceWithDeparturesQuery({
        pollInterval: REFRESH_INTERVAL,
        variables: {
            id: stopPlaceId,
        },
    })

    const stopPlaceWithEstimatedCalls = useMemo(
        () => toStopPlaceWithEstimatedCalls(data?.stopPlace) ?? null,
        [data?.stopPlace],
    )

    return {
        stopPlaceWithEstimatedCalls,
        loading,
        error,
    }
}

export { useStopPlaceWithEstimatedCalls }
