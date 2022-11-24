import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { isNotNullOrUndefined } from '../../utils/typeguards'
import {
    FilterPlaceType,
    MultiModalMode,
    useNearbyStopPlaceIdsQuery,
} from '../../../graphql-generated/journey-planner-v3'
import { useSettings } from '../../settings/SettingsProvider'

interface UseNearbyStopPlaceIds {
    nearbyStopPlaceIds: string[]
    loading: boolean
    error: ApolloError | undefined
}

function useNearbyStopPlaceIds(distance = 2000): UseNearbyStopPlaceIds {
    const [settings] = useSettings()
    const { data, loading, error } = useNearbyStopPlaceIdsQuery({
        variables: {
            latitude: settings.coordinates.latitude,
            longitude: settings.coordinates.longitude,
            maximumDistance: distance,
            filterByPlaceTypes: [FilterPlaceType.StopPlace],
            multiModalMode: MultiModalMode.Parent,
        },
        fetchPolicy: 'cache-and-network',
    })

    const nearbyStopPlaceIds = useMemo(
        () =>
            data?.nearest?.edges
                ?.map((edge) => edge?.node?.place?.id)
                .filter(isNotNullOrUndefined) ?? [],
        [data?.nearest],
    )

    return {
        nearbyStopPlaceIds,
        loading,
        error,
    }
}

export { useNearbyStopPlaceIds }
