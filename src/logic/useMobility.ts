import { useEffect, useMemo, useState } from 'react'

import { Coordinates } from '@entur/sdk'

import { FormFactor, Operator, Vehicle } from '@entur/sdk/lib/mobility/types'

import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL } from '../constants'

import { createAbortController } from '../utils'

import { useOperators } from '.'

async function fetchVehicles(
    coordinates: Coordinates,
    distance: number,
    operators: Operator[],
    signal?: AbortSignal,
    formFactor?: FormFactor,
): Promise<Vehicle[]> {
    if (!coordinates || !distance || !operators?.length) {
        return []
    }

    return service.mobility.getVehicles(
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
}

const EMPTY_VEHICLES: Vehicle[] = []

export default function useMobility(formFactor?: FormFactor): Vehicle[] {
    const [settings] = useSettingsContext()
    const allOperators = useOperators()
    const [vehicles, setVehicles] = useState<Vehicle[]>(EMPTY_VEHICLES)

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
        const abortController = createAbortController()
        if (!coordinates || !distance || isDisabled) {
            return setVehicles(EMPTY_VEHICLES)
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
