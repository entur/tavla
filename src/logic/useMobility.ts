import { useState, useEffect, useMemo } from 'react'
import { ScooterOperator, Scooter, Coordinates } from '@entur/sdk'

import { MobilityTypes } from '@entur/sdk'

import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL, ALL_OPERATORS } from '../constants'
import { Vehicle } from '@entur/sdk/lib/mobility/types'

enum VehicleOperator {
    BOLT = 'YBO:Operator:bolt',
    LIME = 'YLI:Operator:lime',
    VOI = 'YVO:Operator:voi',
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
): Promise<Scooter[]> {
    if (!coordinates || !distance || !operators?.length) {
        return []
    }

    // return service.getScootersByPosition({
    //     latitude: coordinates.latitude,
    //     longitude: coordinates.longitude,
    //     distance,
    //     limit: 50,
    //     operators,
    // })

    const vehicles: Promise<Vehicle[]> = service.mobility.getVehicles({
        lat: Number(coordinates.latitude),
        lon: Number(coordinates.longitude),
        range: distance,
        count: 50,
        operators: Object.values(VehicleOperator),
        formFactors: [MobilityTypes.FormFactor.SCOOTER],
    })

    console.log(vehicles)
    return vehicles
}

export default function useMobility(): Scooter[] | null {
    const [settings] = useSettingsContext()
    const [scooters, setScooters] = useState<Scooter[] | null>([])

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
            return setScooters(null)
        }

        fetchVehicles(coordinates, distance, operators).then(setScooters)
        const intervalId = setInterval(() => {
            fetchVehicles(coordinates, distance, operators).then(setScooters)
        }, REFRESH_INTERVAL)

        return (): void => clearInterval(intervalId)
    }, [coordinates, distance, operators, isDisabled])

    return scooters
}
