import { useState, useEffect, useMemo } from 'react'
import { ScooterOperator, Scooter, Coordinates } from '@entur/sdk'

import { Vehicle, FormFactor } from '@entur/sdk/lib/mobility/types'

import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL, ALL_OPERATORS } from '../constants'

enum VehicleOperator {
    BOLT = 'YBO:Operator:bolt',
    LIME = 'YLI:Operator:lime',
    VOI = 'YVO:Operator:voi',
    TIER = 'YVO:Operator:tier',
    BERGEN_BYSYKKEL = 'YBE:Operator:bergenbysykkel',
    KOLUMBUS_BYSYKKEL = 'YKO:Operator:kolumbusbysykkel',
    OSLO_BYSYKKEL = 'YOS:Operator:oslobysykkel',
    TRONDHEIM_BYSYKKEL = 'YTR:Operator:trondheimbysykkel',
}

export function countScootersByOperator(
    list: Scooter[] | null,
): Record<ScooterOperator, Scooter[]> | null {
    if (list === null) {
        return null
    }
    const operators: Record<ScooterOperator, Scooter[]> = {
        [ScooterOperator.BOLT]: [],
        [ScooterOperator.LIME]: [],
        [ScooterOperator.TIER]: [],
        [ScooterOperator.VOI]: [],
        [ScooterOperator.ZVIPP]: [],
    }
    list?.forEach((scooter) => operators[scooter.operator].push(scooter))
    return operators
}

async function fetchVehicles(
    coordinates: Coordinates,
    distance: number,
    operators: ScooterOperator[],
    formFactors: FormFactor[],
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
        formFactors,
    })

    console.log(vehicles)
    return vehicles
}

export default function useMobility(
    formFactors: FormFactor[] = [],
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
    }, [coordinates, distance, operators, isDisabled, formFactors])

    return vehicles
}
