import { useState, useEffect, useMemo } from 'react'
import { ScooterOperator, Scooter, Coordinates } from '@entur/sdk'

import { MobilityTypes } from '@entur/sdk'

import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL, ALL_OPERATORS } from '../constants'

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

async function fetchScooters(
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

    const scooters = service.mobility.getVehicles({
        lat: Number(coordinates.latitude),
        lon: Number(coordinates.longitude),
        range: distance,
        count: 50,
        operators,
        formFactors: [MobilityTypes.FormFactor.SCOOTER],
    }) as unknown as Scooter[]
    return scooters
}

export default function useScooters(): Scooter[] | null {
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

        fetchScooters(coordinates, distance, operators).then(setScooters)
        const intervalId = setInterval(() => {
            fetchScooters(coordinates, distance, operators).then(setScooters)
        }, REFRESH_INTERVAL)

        return (): void => clearInterval(intervalId)
    }, [coordinates, distance, operators, isDisabled])

    return scooters
}
