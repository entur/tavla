import { useCallback, useEffect, useMemo } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import type { FetchResult } from '@apollo/client'
import { BoundingBox } from '../../../graphql-generated/vehicles-v1'
import {
    SWEEP_INTERVAL_MS,
    DEFAULT_FETCH_POLICY,
    BUFFER_SIZE,
    BUFFER_TIME,
} from '../../constants'
import { useSettings } from '../../settings/SettingsProvider'
import { useStopPlacesWithLines } from '../useStopPlacesWithLines'
import { useVehicleReducer, ActionType } from './useRealtimeVehicleReducer'
import { RealtimeVehicle } from './types'
import VEHICLE_UPDATES_SUBSCRIPTION from './VehicleUpdatesSubscription.vehicles.graphql'
import VEHICLES_QUERY from './VehiclesQuery.vehicles.graphql'

interface QueryData {
    vehicles: RealtimeVehicle[]
}

/**
 * Hook to query and subscribe to remote vehicle data
 */
function useRealtimeVehicleData(boundingBox: BoundingBox): RealtimeVehicle[] {
    const client = useApolloClient()
    const [state, dispatch] = useVehicleReducer()
    const uniqueLines = useStopPlacesWithLines()
    const [settings] = useSettings()
    const { hiddenRealtimeDataLineRefs } = settings || {}

    const filterVehiclesByLineRefs = useCallback(
        (vehiclesUpdates: RealtimeVehicle[] | undefined) => {
            if (!vehiclesUpdates || settings?.hideRealtimeData) {
                return undefined
            }

            const filteredUpdates = vehiclesUpdates.filter(
                (vehicle) =>
                    uniqueLines
                        .map((line) => line.id)
                        .includes(vehicle.line.lineRef) &&
                    hiddenRealtimeDataLineRefs &&
                    !hiddenRealtimeDataLineRefs?.includes(vehicle.line.lineRef),
            )

            return filteredUpdates.length > 0 ? filteredUpdates : undefined
        },
        [uniqueLines, hiddenRealtimeDataLineRefs, settings?.hideRealtimeData],
    )

    const handleQueryData = useCallback(
        ({ vehicles }: QueryData) => {
            const filteredUpdates = filterVehiclesByLineRefs(vehicles)
            if (filteredUpdates && filteredUpdates?.length > 0)
                dispatch({
                    type: ActionType.HYDRATE,
                    payload: filteredUpdates,
                })
        },
        [dispatch, filterVehiclesByLineRefs],
    )

    useQuery<QueryData>(VEHICLES_QUERY, {
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: { boundingBox },
        skip: !uniqueLines,
        onCompleted: handleQueryData,
    })

    useEffect(() => {
        const subscription = client
            .subscribe({
                query: VEHICLE_UPDATES_SUBSCRIPTION,
                fetchPolicy: DEFAULT_FETCH_POLICY,
                variables: {
                    boundingBox,
                    bufferSize: BUFFER_SIZE,
                    bufferTime: BUFFER_TIME,
                },
            })
            .subscribe((fetchResult: FetchResult) => {
                if (fetchResult?.data?.vehicleUpdates.length > 0) {
                    const filteredUpdates = filterVehiclesByLineRefs(
                        fetchResult?.data?.vehicleUpdates,
                    )
                    if (filteredUpdates)
                        dispatch({
                            type: ActionType.UPDATE,
                            payload: filteredUpdates,
                        })
                }
            })

        return () => {
            subscription.unsubscribe()
        }
    }, [client, boundingBox, filterVehiclesByLineRefs, dispatch])

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
            (Object.values(state.vehicles) as RealtimeVehicle[]).map(
                (vehicle) => {
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
                },
            ),
        [state.vehicles, uniqueLines],
    )
}

export { useRealtimeVehicleData }
