import { useState, useEffect } from 'react'
import { ScooterOperator, Scooter } from '@entur/sdk'

import service from '../service'
import { useSettingsContext, Settings } from '../settings'
import { REFRESH_INTERVAL, ALL_OPERATORS } from '../constants'

export function countScootersByOperator(
    list: Scooter[] | null,
): Record<ScooterOperator, Scooter[]> | null {
    if (list === null) {
        return null
    }
    const operators: Record<ScooterOperator, Scooter[]> = {
        [ScooterOperator.VOI]: [],
        [ScooterOperator.TIER]: [],
        [ScooterOperator.LIME]: [],
        [ScooterOperator.ZVIPP]: [],
    }
    list?.forEach((scooter) => operators[scooter.operator].push(scooter))
    return operators
}

async function fetchScooters(settings: Settings): Promise<Scooter[] | null> {
    const { coordinates, distance, hiddenModes, hiddenOperators } = settings

    if (hiddenModes.includes('sparkesykkel')) {
        return null
    }

    let scooters: Scooter[] = []
    if (coordinates) {
        scooters = await service.getScootersByPosition({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            distance,
            limit: 50,
            operators: ALL_OPERATORS.filter(
                (operator) => !hiddenOperators.includes(operator),
            ),
        })
    }
    return scooters
}

export default function useScooters(): Scooter[] | null {
    const [settings] = useSettingsContext()
    const [scooters, setScooters] = useState<Scooter[] | null>([])

    useEffect(() => {
        if (!settings) return
        fetchScooters(settings).then(setScooters)
        const intervalId = setInterval(() => {
            fetchScooters(settings).then(setScooters)
        }, REFRESH_INTERVAL)
        return (): void => clearInterval(intervalId)
    }, [settings])
    return scooters
}
