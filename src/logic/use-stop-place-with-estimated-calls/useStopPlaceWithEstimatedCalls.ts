import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { useStopPlaceWithEstimatedCallsQuery } from 'graphql-generated/journey-planner-v3'
import { REFRESH_INTERVAL } from '../../constants'
import {
    StopPlaceWithEstimatedCalls,
    toStopPlaceWithEstimatedCalls,
} from './types'

interface UseStopPlaceWithEstimatedCalls {
    stopPlaceWithEstimatedCalls: StopPlaceWithEstimatedCalls | null
    loading: boolean
    error: ApolloError | undefined
}

interface Options {
    stopPlaceId: string
    timeRange?: number
    numberOfDeparturesPerLineAndDestinationDisplay?: number
    numberOfDepartures?: number
}

function useStopPlaceWithEstimatedCalls({
    stopPlaceId,
    timeRange,
    numberOfDeparturesPerLineAndDestinationDisplay,
    numberOfDepartures,
}: Options): UseStopPlaceWithEstimatedCalls {
    const { data, loading, error } = useStopPlaceWithEstimatedCallsQuery({
        pollInterval: REFRESH_INTERVAL,
        variables: {
            id: stopPlaceId,
            timeRange,
            numberOfDeparturesPerLineAndDestinationDisplay,
            numberOfDepartures,
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
