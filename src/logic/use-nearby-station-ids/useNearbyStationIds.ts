import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import {
    FormFactor,
    useNearbyStationIdsQuery,
} from '../../../graphql-generated/mobility-v2'
import { useSettings } from '../../settings/SettingsProvider'
import { isNotNullOrUndefined } from '../../utils/typeguards'

interface UseNearbyStationIds {
    nearbyStationIds: string[]
    loading: boolean
    error: ApolloError | undefined
}

function useNearbyStationIds(formFactor?: FormFactor[]): UseNearbyStationIds {
    const [settings] = useSettings()

    const { data, loading, error } = useNearbyStationIdsQuery({
        fetchPolicy: 'cache-and-network',
        variables: {
            latitude: settings.coordinates.latitude,
            longitude: settings.coordinates.longitude,
            range: settings.distance,
            formFactor,
        },
    })

    const nearbyStationIds = useMemo(
        () =>
            data?.stations
                ?.filter(isNotNullOrUndefined)
                .flatMap((station) => station.id) ?? [],
        [data?.stations],
    )

    return {
        nearbyStationIds,
        loading,
        error,
    }
}

export { useNearbyStationIds }
