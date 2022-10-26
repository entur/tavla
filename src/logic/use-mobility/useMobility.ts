import { useEffect, useMemo } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { FormFactor, Operator, Vehicle } from '@entur/sdk/lib/mobility/types'
import { useSettings } from '../../settings/SettingsProvider'
import { REFRESH_INTERVAL, ALL_ACTIVE_OPERATOR_IDS } from '../../constants'
import GetOperators from './GetOperators.mobility.graphql'
import GetVehicles from './GetVehicles.mobility.graphql'

function useMobility(formFactor?: FormFactor): Vehicle[] | undefined {
    const [settings] = useSettings()
    const { data: getOperatorsData } = useQuery<{ operators: Operator[] }>(
        GetOperators,
    )
    const [getVehicles, { data: getVehiclesData }] = useLazyQuery<{
        vehicles: Vehicle[]
    }>(GetVehicles)

    const { coordinates, distance, hiddenMobilityOperators, hiddenModes } =
        settings || {}

    const isDisabled = Boolean(hiddenModes?.includes('sparkesykkel'))

    const operators = useMemo(
        () =>
            getOperatorsData?.operators
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
                formFactor: formFactor ? [formFactor] : undefined,
            },
        }).finally()
    }, [coordinates, distance, operators, isDisabled, formFactor, getVehicles])

    return getVehiclesData?.vehicles ?? []
}

export { useMobility }
