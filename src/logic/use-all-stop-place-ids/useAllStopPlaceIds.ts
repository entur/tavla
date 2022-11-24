import { useMemo } from 'react'
import { difference, union } from 'lodash'
import { ApolloError } from '@apollo/client'
import { useNearbyStopPlaceIds } from '../use-nearby-stop-place-ids/useNearbyStopPlaceIds'
import { useSettings } from '../../settings/SettingsProvider'

interface UseAllStopPlaceIds {
    allStopPlaceIds: string[]
    loading: boolean
    error: ApolloError | undefined
}

/**
 * Hook that combines all StopPlace id's from useNearestStopPlaces and
 * settings.newStops, and filters away ids from settings.hiddenStops.
 * Also returns fetching state from useNearestStopPlaces.
 */
function useAllStopPlaceIds(): UseAllStopPlaceIds {
    const [settings] = useSettings()

    const { nearbyStopPlaceIds, loading, error } = useNearbyStopPlaceIds(
        settings.distance,
    )

    const allStopPlaceIds = useMemo(
        () =>
            difference(
                union(settings.newStops, nearbyStopPlaceIds),
                settings.hiddenStops,
            ),
        [nearbyStopPlaceIds, settings.newStops, settings.hiddenStops],
    )

    return {
        allStopPlaceIds,
        loading,
        error,
    }
}

export { useAllStopPlaceIds }
