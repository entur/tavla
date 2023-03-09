import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { uniqBy } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { useUniqueLinesQuery } from 'graphql-generated/journey-planner-v3'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { Line } from 'src/types'
import { toStruct } from 'utils/utils'
import { LineDataStruct, LineData } from 'types/structs'
import { useStopPlaceIds } from '../useStopPlaceIds'

type UseUniqueLines = {
    uniqueLines: Line[]
    loading: boolean
    error: ApolloError | undefined
}

function toLine(data: LineData): Line {
    return {
        id: data.serviceJourney.line.id,
        name: `${data.serviceJourney.line.publicCode} ${data.destinationDisplay.frontText}`,
        transportMode: data.serviceJourney.line.transportMode,
        transportSubmode: data.serviceJourney.line.transportSubmode,
        publicCode: data.serviceJourney.line.publicCode,
        pointsOnLink: data.serviceJourney.pointsOnLink.points,
    }
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
            .map(toStruct(LineDataStruct))
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
