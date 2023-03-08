import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { difference, union } from 'lodash'
import { FormFactor, useStationIdsQuery } from 'graphql-generated/mobility-v2'
import { useSettings } from 'settings/SettingsProvider'
import { isNotNullOrUndefined } from 'utils/typeguards'

type Options = {
    formFactors?: FormFactor[]
    filterHiddenRoutes?: boolean
}

function useStationIds(
    { formFactors, filterHiddenRoutes }: Options = { filterHiddenRoutes: true },
): {
    stationIds: string[]
    loading: boolean
    error: ApolloError | undefined
} {
    const [settings] = useSettings()

    const { data, loading, error } = useStationIdsQuery({
        fetchPolicy: 'cache-and-network',
        variables: {
            latitude: settings.coordinates.latitude,
            longitude: settings.coordinates.longitude,
            range: settings.distance,
            formFactors,
        },
    })

    const stationIds = useMemo(() => {
        const nearby =
            data?.stations
                ?.filter(isNotNullOrUndefined)
                .flatMap((station) => station.id) ?? []

        return difference(
            union(settings.newStations, nearby),
            filterHiddenRoutes ? settings.hiddenStations : [],
        )
    }, [
        data?.stations,
        filterHiddenRoutes,
        settings.newStations,
        settings.hiddenStations,
    ])

    return {
        stationIds,
        loading,
        error,
    }
}

export { useStationIds }
