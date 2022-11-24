import { useMemo } from 'react'
import { difference, union } from 'lodash'
import { ApolloError } from '@apollo/client'
import { useNearbyStationIds } from '../use-nearby-station-ids/useNearbyStationIds'
import { FormFactor } from '../../../graphql-generated/mobility-v2'
import { useSettings } from '../../settings/SettingsProvider'

interface UseAllStationIds {
    allStationIds: string[]
    loading: boolean
    error?: ApolloError
}

/**
 * Hook that combines all StationIds from useNearbyStationIds and settings.newStations,
 * and then filters ids from settings.hiddenStations.
 * @param formFactor
 */
function useAllStationIds(formFactor?: FormFactor[]): UseAllStationIds {
    const [settings] = useSettings()
    const { nearbyStationIds, loading, error } = useNearbyStationIds(formFactor)

    const allStationIds = useMemo(
        () =>
            difference(
                union(settings.newStations, nearbyStationIds),
                settings.hiddenStations,
            ),
        [nearbyStationIds, settings.newStations, settings.hiddenStations],
    )

    return {
        allStationIds,
        loading,
        error,
    }
}

export { useAllStationIds }
