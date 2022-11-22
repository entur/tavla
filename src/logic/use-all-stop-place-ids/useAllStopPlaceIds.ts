import { useMemo } from 'react'
import { difference, union } from 'lodash'
import { ApolloError } from '@apollo/client'
import { useNearestStopPlaces } from '../use-nearest-stop-places/useNearestStopPlaces'
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

    const { nearestStopPlaces, loading, error } = useNearestStopPlaces(
        settings.coordinates,
        settings.distance,
    )

    const allStopPlaceIds = useMemo(() => {
        const nearestStopId = nearestStopPlaces.map((it) => it.id)
        return difference(
            union(settings.newStops, nearestStopId),
            settings.hiddenStops,
        )
    }, [nearestStopPlaces, settings.newStops, settings.hiddenStops])

    return {
        allStopPlaceIds,
        loading,
        error,
    }
}

export { useAllStopPlaceIds }
