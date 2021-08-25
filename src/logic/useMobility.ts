import { useState, useEffect, useMemo } from 'react'
import { Coordinates } from '@entur/sdk'

import { Vehicle, FormFactor, Operator } from '@entur/sdk/lib/mobility/types'

import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL, ALL_ACTIVE_OPERATOR_IDS } from '../constants'
import useOperators from './useOperators'
import { FileSystemCredentials } from 'aws-sdk'

async function fetchVehicles(
    coordinates: Coordinates,
    distance: number,
    operators: Operator[],
    formFactors: FormFactor[] | undefined,
): Promise<Vehicle[]> {
    if (!coordinates || !distance || !operators?.length) {
        return []
    }

    const vehicles: Promise<Vehicle[]> = service.mobility.getVehicles({
        lat: Number(coordinates.latitude),
        lon: Number(coordinates.longitude),
        range: distance,
        count: 50,
        operators: operators.map((operator) => operator.id),
        formFactors: formFactors ? formFactors : undefined,
    })

    return vehicles
}

export default function useMobility(
    formFactors: FormFactor[] | undefined = undefined,
): Vehicle[] | null {
    const [settings] = useSettingsContext()
    const allOperators = useOperators(Object.values(ALL_ACTIVE_OPERATOR_IDS))
    const [vehicles, setVehicles] = useState<Vehicle[] | null>([])

    const { coordinates, distance, hiddenMobilityOperators, hiddenModes } =
        settings || {}

    const operators = useMemo(() => {
        return allOperators.filter(
            (operator) =>
                !hiddenMobilityOperators ||
                !hiddenMobilityOperators?.includes(operator.id),
        )
    }, [hiddenMobilityOperators, allOperators])

    const isDisabled = Boolean(hiddenModes?.includes('sparkesykkel'))

    useEffect(() => {
        if (!coordinates || !distance || isDisabled) {
            return setVehicles(null)
        }

        fetchVehicles(coordinates, distance, operators, formFactors)
            .then(setVehicles)
            // eslint-disable-next-line no-console
            .catch((error) => console.error(error))

        const intervalId = setInterval(() => {
            fetchVehicles(coordinates, distance, operators, formFactors).then(
                setVehicles,
            )
        }, REFRESH_INTERVAL)

        return (): void => clearInterval(intervalId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coordinates, distance, operators, isDisabled])

    return vehicles
}
