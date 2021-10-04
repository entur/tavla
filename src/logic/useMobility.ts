import { useState, useEffect, useMemo } from 'react'
import { Coordinates } from '@entur/sdk'

import { Vehicle, FormFactor, Operator } from '@entur/sdk/lib/mobility/types'

import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL } from '../constants'

import { useOperators } from '.'

async function fetchVehicles(
    coordinates: Coordinates,
    distance: number,
    operators: Operator[],
    signal: AbortSignal,
    formFactor?: FormFactor,
): Promise<Vehicle[]> {
    if (!coordinates || !distance || !operators?.length) {
        return []
    }

    const vehicles: Promise<Vehicle[]> = service.mobility.getVehicles(
        {
            lat: Number(coordinates.latitude),
            lon: Number(coordinates.longitude),
            range: distance,
            count: 50,
            operators: operators.map((operator) => operator.id),
            formFactors: formFactor ? [formFactor] : undefined,
        },
        { signal },
    )

    return vehicles
}

export default function useMobility(formFactor?: FormFactor): Vehicle[] | null {
    const [settings] = useSettingsContext()
    const allOperators = useOperators()
    const [vehicles, setVehicles] = useState<Vehicle[] | null>([])

    const { coordinates, distance, hiddenMobilityOperators, hiddenModes } =
        settings || {}

    const operators = useMemo(
        () =>
            allOperators.filter(
                (operator) =>
                    !hiddenMobilityOperators ||
                    !hiddenMobilityOperators?.includes(operator.id),
            ),
        [hiddenMobilityOperators, allOperators],
    )

    const isDisabled = Boolean(hiddenModes?.includes('sparkesykkel'))

    useEffect(() => {
        const abortController = new AbortController()
        if (!coordinates || !distance || isDisabled) {
            return setVehicles(null)
        }

        fetchVehicles(
            coordinates,
            distance,
            operators,
            abortController.signal,
            formFactor,
        )
            .then(setVehicles)
            .catch((error) => {
                if (error.name !== 'AbortError') throw error
            })

        const intervalId = setInterval(() => {
            fetchVehicles(
                coordinates,
                distance,
                operators,
                abortController.signal,
                formFactor,
            )
                .then(setVehicles)
                .catch((error) => {
                    if (error.name !== 'AbortError') throw error
                })
        }, REFRESH_INTERVAL)

        return (): void => {
            clearInterval(intervalId)
            abortController.abort()
        }
    }, [coordinates, distance, operators, isDisabled, formFactor])

    return vehicles
}
