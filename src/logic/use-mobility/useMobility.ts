import { useEffect, useMemo } from 'react'
import { useSettings } from '../../settings/SettingsProvider'
import {
    useUseMobility_OperatorsQuery,
    UseMobility_VehicleFragment,
    FormFactor,
    useUseMobility_VehiclesLazyQuery,
} from '../../../graphql-generated/mobility-v2'
import { REFRESH_INTERVAL, ALL_ACTIVE_OPERATOR_IDS } from '../../constants'
import { isNotNullOrUndefined } from '../../utils/typeguards'

function useMobility(
    formFactor?: FormFactor,
    customDistance?: number,
): UseMobility_VehicleFragment[] {
    const [settings] = useSettings()
    const { data: getOperatorsData } = useUseMobility_OperatorsQuery()
    const [getVehicles, { data: getVehiclesData }] =
        useUseMobility_VehiclesLazyQuery()

    const distance = customDistance || settings.distance

    const isDisabled = Boolean(settings.hiddenModes.includes('sparkesykkel'))

    const operators = useMemo(
        () =>
            getOperatorsData?.operators
                ?.filter(isNotNullOrUndefined)
                .filter((operator) => !ALL_ACTIVE_OPERATOR_IDS[operator.id])
                .filter(
                    (operator) =>
                        !settings.hiddenMobilityOperators.includes(operator.id),
                ) ?? [],
        [settings.hiddenMobilityOperators, getOperatorsData?.operators],
    )

    useEffect(() => {
        if (isDisabled) {
            return
        }
        getVehicles({
            fetchPolicy: 'cache-and-network',
            pollInterval: REFRESH_INTERVAL,
            variables: {
                lat: settings.coordinates.latitude,
                lon: settings.coordinates.longitude,
                range: distance,
                count: 100,
                operators: operators
                    .map((operator) => operator.id)
                    .filter((id) => !ALL_ACTIVE_OPERATOR_IDS[id]),
                formFactors: formFactor ? [formFactor] : undefined,
            },
        }).finally()
    }, [
        settings.coordinates,
        distance,
        operators,
        isDisabled,
        formFactor,
        getVehicles,
    ])

    return getVehiclesData?.vehicles?.filter(isNotNullOrUndefined) ?? []
}

export { useMobility }
