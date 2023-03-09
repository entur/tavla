import { useCallback, useEffect, useMemo } from 'react'
import {
    BoundingBox,
    useRealtimeVehicleQuery,
    useRealtimeVehicleSubscription,
} from 'graphql-generated/vehicles-v1'
import { useSettings } from 'settings/SettingsProvider'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { SWEEP_INTERVAL_MS, BUFFER_SIZE, BUFFER_TIME } from 'utils/constants'
import { toStruct } from 'utils/utils'
import { RealtimeVehicleStruct, RealtimeVehicle } from 'types/structs'
import { useUniqueLines } from '../useUniqueLines'
import { useVehicleReducer, ActionType } from './useRealtimeVehicleReducer'

/**
 * Hook to query and subscribe to remote vehicle data
 */
function useRealtimeVehicleData(boundingBox: BoundingBox): RealtimeVehicle[] {
    const [state, dispatch] = useVehicleReducer()
    const { uniqueLines, loading: uniqueLinesLoading } = useUniqueLines()
    const [settings] = useSettings()

    const filterVehicleByLineRefs = useCallback(
        (vehicle: RealtimeVehicle) =>
            uniqueLines.map((line) => line.id).includes(vehicle.line.lineRef) &&
            !settings.hiddenRealtimeDataLineRefs.includes(vehicle.line.lineRef),
        [uniqueLines, settings.hiddenRealtimeDataLineRefs],
    )

    useRealtimeVehicleQuery({
        fetchPolicy: 'no-cache',
        variables: { boundingBox },
        skip: uniqueLinesLoading || settings.hideRealtimeData,
        onCompleted: ({ vehicles }) => {
            const filteredVehicles =
                vehicles
                    ?.map(toStruct(RealtimeVehicleStruct))
                    .filter(isNotNullOrUndefined)
                    .filter(filterVehicleByLineRefs) ?? []

            dispatch({
                type: ActionType.HYDRATE,
                payload: filteredVehicles,
            })
        },
    })

    useRealtimeVehicleSubscription({
        fetchPolicy: 'no-cache',
        skip: uniqueLinesLoading || settings.hideRealtimeData,
        variables: {
            boundingBox,
            bufferSize: BUFFER_SIZE,
            bufferTime: BUFFER_TIME,
        },
        onData: (options) => {
            const vehicles = options.data.data?.vehicleUpdates ?? []
            const filteredVehicles = vehicles
                .map(toStruct(RealtimeVehicleStruct))
                .filter(isNotNullOrUndefined)
                .filter(filterVehicleByLineRefs)

            dispatch({
                type: ActionType.UPDATE,
                payload: filteredVehicles,
            })
        },
    })

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch({ type: ActionType.SWEEP })
        }, SWEEP_INTERVAL_MS)

        return () => {
            clearInterval(interval)
        }
    }, [dispatch])

    return useMemo(
        () =>
            Object.values(state.vehicles).map((vehicle) => {
                const line = uniqueLines.find(
                    (l) => l.id === vehicle.line.lineRef,
                )
                return {
                    ...vehicle,
                    line: {
                        ...vehicle.line,
                        publicCode: line?.publicCode,
                        pointsOnLink: line?.pointsOnLink,
                    },
                }
            }),
        [state.vehicles, uniqueLines],
    )
}

export { useRealtimeVehicleData }
