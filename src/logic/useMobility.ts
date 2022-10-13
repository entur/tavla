import { useEffect, useMemo, useState } from 'react'
// Workaround for incompatible AbortSignal types between lib.dom and @entur/sdk
import { AbortSignal as AbortSignalNodeFetch } from 'node-fetch/externals'
import { FormFactor, Operator, Vehicle } from '@entur/sdk/lib/mobility/types'
import { Coordinates } from '@entur/sdk'
import { enturClient } from '../service'
import { useSettings } from '../settings/SettingsProvider'
import { REFRESH_INTERVAL, ALL_ACTIVE_OPERATOR_IDS } from '../constants'
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

    return enturClient.mobility.getVehicles(
        {
            lat: Number(coordinates.latitude),
            lon: Number(coordinates.longitude),
            range: distance,
            count: 50,
            operators: operators
                .map((operator) => operator.id)
                .filter((o) =>
                    Object.values(ALL_ACTIVE_OPERATOR_IDS).includes(o),
                ),
            formFactors: formFactor ? [formFactor] : undefined,
        },
        { signal: signal as AbortSignalNodeFetch },
    )
}

const EMPTY_VEHICLES: Vehicle[] = []

function useMobility(formFactor?: FormFactor): Vehicle[] | undefined {
    const [settings] = useSettings()
    const allOperators = useOperators()
    const [vehicles, setVehicles] = useState<Vehicle[]>()

    const { coordinates, distance, hiddenMobilityOperators, hiddenModes } =
        settings || {}

    const operators = useMemo(
        () =>
            allOperators.filter(
                (operator: { id: string }) =>
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

export { useMobility }
