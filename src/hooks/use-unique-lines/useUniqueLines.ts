import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { uniqBy } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { useUniqueLinesQuery } from 'graphql-generated/journey-planner-v3'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { Line } from 'src/types'
import { useStopPlaceIds } from '../use-stop-place-ids/useStopPlaceIds'
import { toEstimatedCall } from './types'
import { toLine } from './line'

type UseUniqueLines = {
    uniqueLines: Line[]
    loading: boolean
    error: ApolloError | undefined
}

function useUniqueLines(): UseUniqueLines {
    const [settings] = useSettings()
    const {
        stopPlaceIds,
        loading: allStopPlaceIdsLoading,
        error: allStopPlaceIdsError,
    } = useStopPlaceIds()

    const { data, loading, error } = useUniqueLinesQuery({
        variables: {
            ids: stopPlaceIds,
        },
        skip: allStopPlaceIdsLoading,
    })

    const uniqueLines = useMemo(() => {
        const lines = data?.stopPlaces
            .filter(isNotNullOrUndefined)
            .flatMap((sp) => sp.estimatedCalls)
            .map(toEstimatedCall)
            .filter(isNotNullOrUndefined)
            .map(toLine)
            .filter(
                (line) =>
                    !settings.hiddenStopModes[line.id]?.includes(
                        line.transportMode,
                    ),
            )

        return uniqBy(lines, 'id')
    }, [data?.stopPlaces, settings.hiddenStopModes])

    return {
        uniqueLines,
        loading: loading || allStopPlaceIdsLoading,
        error: error || allStopPlaceIdsError,
    }
}

export { useUniqueLines }
