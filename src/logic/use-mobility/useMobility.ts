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
): UseMobility_VehicleFragment[] | undefined {
    const [settings] = useSettings()
    const { data: getOperatorsData } = useUseMobility_OperatorsQuery()
    const [getVehicles, { data: getVehiclesData }] =
        useUseMobility_VehiclesLazyQuery()

    const {
        coordinates,
        distance: globalDistance,
        hiddenMobilityOperators,
        hiddenModes,
    } = settings || {}

    const distance = customDistance || globalDistance

    const isDisabled = Boolean(hiddenModes?.includes('sparkesykkel'))

    const operators = useMemo(
        () =>
            getOperatorsData?.operators
                ?.filter(isNotNullOrUndefined)
                .filter((operator) => !ALL_ACTIVE_OPERATOR_IDS[operator.id])
                .filter(
                    (operator) =>
                        !hiddenMobilityOperators ||
                        !hiddenMobilityOperators?.includes(operator.id),
                ) ?? [],
        [hiddenMobilityOperators, getOperatorsData?.operators],
    )

    useEffect(() => {
        if (!coordinates || !distance || isDisabled) {
            return
        }
        getVehicles({
            fetchPolicy: 'cache-and-network',
            pollInterval: REFRESH_INTERVAL,
            variables: {
                lat: coordinates.latitude,
                lon: coordinates.longitude,
                range: distance,
                count: 100,
                operators: operators
                    .map((operator) => operator.id)
                    .filter((id) => !ALL_ACTIVE_OPERATOR_IDS[id]),
                formFactors: formFactor ? [formFactor] : undefined,
            },
        }).finally()
    }, [coordinates, distance, operators, isDisabled, formFactor, getVehicles])

    return getVehiclesData?.vehicles?.filter(isNotNullOrUndefined) ?? []
}

export { useMobility }
