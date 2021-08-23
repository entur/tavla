import { useState, useEffect, useMemo } from 'react'
import { Coordinates } from '@entur/sdk'

import { Vehicle, FormFactor } from '@entur/sdk/lib/mobility/types'

import service from '../service'
import { useSettingsContext } from '../settings'
import { VehicleOperator, REFRESH_INTERVAL, ALL_OPERATORS } from '../constants'

async function fetchVehicles(
    coordinates: Coordinates,
    distance: number,
    operators: VehicleOperator[],
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
        operators: Object.values(VehicleOperator),
        formFactors: formFactors ? formFactors : undefined,
    })

    console.log(vehicles)
    return vehicles
}

export default function useMobility(
    formFactors: FormFactor[] | undefined = undefined,
): Vehicle[] | null {
    const [settings] = useSettingsContext()
    const [vehicles, setVehicles] = useState<Vehicle[] | null>([])

    const { coordinates, distance, hiddenOperators, hiddenModes } =
        settings || {}

    const operators = useMemo(
        () =>
            ALL_OPERATORS.filter(
                (operator) =>
                    !hiddenOperators || !hiddenOperators?.includes(operator),
            ),
        [hiddenOperators],
    )

    const isDisabled = Boolean(hiddenModes?.includes('sparkesykkel'))

    useEffect(() => {
        if (!coordinates || !distance || isDisabled) {
            return setVehicles(null)
        }

        fetchVehicles(coordinates, distance, operators, formFactors).then(
            setVehicles,
        )
        const intervalId = setInterval(() => {
            fetchVehicles(coordinates, distance, operators, formFactors).then(
                setVehicles,
            )
        }, REFRESH_INTERVAL)

        return (): void => clearInterval(intervalId)
    }, [coordinates, distance, operators, isDisabled])

    return vehicles
}
