import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { useSettings } from 'settings/SettingsProvider'
import { FormFactor, useVehiclesQuery } from 'graphql-generated/mobility-v2'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { REFRESH_INTERVAL, ALL_ACTIVE_OPERATOR_IDS } from 'utils/constants'
import { Vehicle } from 'src/types'
import { toStruct } from 'utils/utils'
import { useOperatorIds } from '../useOperatorIds'
import { VehicleStruct } from './structs'

type UseVehicles = {
    vehicles: Vehicle[]
    loading: boolean
    error?: ApolloError
}

function useVehicles(
    distance: number,
    formFactors?: FormFactor[],
): UseVehicles {
    const [settings] = useSettings()
    const {
        operatorIds,
        loading: operatorIdsLoading,
        error: operatorIdsError,
    } = useOperatorIds()

    const operators = useMemo(
        () =>
            operatorIds
                .filter((id) => !ALL_ACTIVE_OPERATOR_IDS[id])
                .filter(
                    (id) => !settings.hiddenMobilityOperators.includes(id),
                ) ?? [],
        [settings.hiddenMobilityOperators, operatorIds],
    )

    const { data, loading, error } = useVehiclesQuery({
        skip: operatorIdsLoading,
        fetchPolicy: 'cache-and-network',
        pollInterval: REFRESH_INTERVAL,
        variables: {
            lat: settings.coordinates.latitude,
            lon: settings.coordinates.longitude,
            range: distance,
            operators,
            formFactors,
        },
    })

    const vehicles = useMemo(
        () =>
            data?.vehicles
                ?.map(toStruct(VehicleStruct))
                .filter(isNotNullOrUndefined) ?? [],
        [data?.vehicles],
    )

    return {
        vehicles,
        loading: operatorIdsLoading || loading,
        error: operatorIdsError || error,
    }
}

export { useVehicles }
