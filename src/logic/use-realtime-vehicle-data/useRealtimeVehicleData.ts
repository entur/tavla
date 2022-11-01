import { useCallback, useEffect, useMemo } from 'react'
import {
    BoundingBox,
    useUseRealtimeVehicleData_VehiclesQuery,
    useUseRealtimeVehicleData_VehiclesSubscription,
} from '../../../graphql-generated/vehicles-v1'
import {
    SWEEP_INTERVAL_MS,
    DEFAULT_FETCH_POLICY,
    BUFFER_SIZE,
    BUFFER_TIME,
} from '../../constants'
import { useSettings } from '../../settings/SettingsProvider'
import { useStopPlacesWithLines } from '../useStopPlacesWithLines'
import { isNotNullOrUndefined } from '../../utils/typeguards'
import { useVehicleReducer, ActionType } from './useRealtimeVehicleReducer'
import { RealtimeVehicle, toRealtimeVehicle } from './types'

/**
 * Hook to query and subscribe to remote vehicle data
 */
function useRealtimeVehicleData(boundingBox: BoundingBox): RealtimeVehicle[] {
    const [state, dispatch] = useVehicleReducer()
    const uniqueLines = useStopPlacesWithLines()
    const [settings] = useSettings()
    const { hiddenRealtimeDataLineRefs } = settings || {}

    const filterVehicleByLineRefs = useCallback(
        (vehicle: RealtimeVehicle) =>
            uniqueLines.map((line) => line.id).includes(vehicle.line.lineRef) &&
            hiddenRealtimeDataLineRefs &&
            !hiddenRealtimeDataLineRefs?.includes(vehicle.line.lineRef),
        [uniqueLines, hiddenRealtimeDataLineRefs],
    )

    useUseRealtimeVehicleData_VehiclesQuery({
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: { boundingBox },
        skip: !uniqueLines || settings?.hideRealtimeData,
        onCompleted: ({ vehicles }) => {
            const filteredVehicles =
                vehicles
                    ?.map(toRealtimeVehicle)
                    .filter(isNotNullOrUndefined)
                    .filter(filterVehicleByLineRefs) ?? []

            dispatch({
                type: ActionType.HYDRATE,
                payload: filteredVehicles,
            })
        },
    })

    useUseRealtimeVehicleData_VehiclesSubscription({
        fetchPolicy: DEFAULT_FETCH_POLICY,
        skip: !uniqueLines || settings?.hideRealtimeData,
        variables: {
            boundingBox,
            bufferSize: BUFFER_SIZE,
            bufferTime: BUFFER_TIME,
        },
        onData: (options) => {
            const vehicles = options.data.data?.vehicleUpdates ?? []
            const filteredVehicles = vehicles
                .map(toRealtimeVehicle)
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
