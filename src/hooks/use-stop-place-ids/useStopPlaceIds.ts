import { useMemo } from 'react'
import { difference, union } from 'lodash'
import { ApolloError } from '@apollo/client'
import { isNotNullOrUndefined } from 'utils/typeguards'
import {
    FilterPlaceType,
    MultiModalMode,
    useStopPlaceIdsQuery,
} from 'graphql-generated/journey-planner-v3'
import { useSettings } from 'settings/SettingsProvider'

type UseStopPlaceIds = {
    stopPlaceIds: string[]
    loading: boolean
    error: ApolloError | undefined
}

type Options = {
    distance?: number
    filterHidden?: boolean
}

function useStopPlaceIds(
    { distance, filterHidden }: Options = { filterHidden: true },
): UseStopPlaceIds {
    const [settings] = useSettings()

    const { data, loading, error } = useStopPlaceIdsQuery({
        skip: settings.hiddenModes.includes('kollektiv'),
        variables: {
            latitude: settings.coordinates.latitude,
            longitude: settings.coordinates.longitude,
            maximumDistance: distance ?? settings.distance,
            filterByPlaceTypes: [FilterPlaceType.StopPlace],
            multiModalMode: MultiModalMode.Parent,
        },
        fetchPolicy: 'cache-and-network',
    })

    const stopPlaceIds = useMemo(() => {
        const nearbyStopPlaceIds =
            data?.nearest?.edges
                ?.map((edge) => edge?.node?.place?.id)
                .filter(isNotNullOrUndefined) ?? []
        return difference(
            union(settings.newStops, nearbyStopPlaceIds),
            filterHidden ? settings.hiddenStops : [],
        )
    }, [data?.nearest, filterHidden, settings.newStops, settings.hiddenStops])

    return {
        stopPlaceIds,
        loading,
        error,
    }
}

export { useStopPlaceIds }
