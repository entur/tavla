import { useQuery, useSubscription } from '@apollo/client'
import type { OnSubscriptionDataOptions } from '@apollo/client'

import { useCallback, useEffect, useState } from 'react'

import { Options } from '../services/realtimeVehicles/types/options'

import { Filter } from '../services/realtimeVehicles/types/filter'
import { RealtimeVehicle } from '../services/realtimeVehicles/types/realtimeVehicle'
import { SubscriptionOptions } from '../services/realtimeVehicles/types/subscriptionOptions'

import {
    VEHICLES_QUERY,
    VEHICLE_UPDATES_SUBSCRIPTION,
} from '../services/realtimeVehicles/graphql'

import { useSettingsContext } from '../settings'

import { useStopPlacesWithLines } from './useStopPlacesWithLines'

import useVehicleReducer, { ActionType } from './useRealtimeVehicleReducer'

const DEFAULT_FETCH_POLICY = 'no-cache'

interface IReturn {
    realtimeVehicles: RealtimeVehicle[] | undefined
    allLinesWithRealtimeData: string[] | undefined
}
interface SubscriptionData {
    vehicleUpdates: RealtimeVehicle[]
}
interface QueryData {
    vehicles: RealtimeVehicle[]
}

export const defaultFilter: Filter = {
    monitored: true,
}

export const defaultSubscriptionOptions: SubscriptionOptions = {
    enableLiveUpdates: true,
    bufferSize: 20,
    bufferTime: 200,
}

export const defaultOptions: Options = {
    sweepIntervalMs: 1000,
    removeExpired: true,
    removeExpiredAfterSeconds: 600,
    markInactive: true,
    markInactiveAfterSeconds: 60,
}

/**
 * Hook to query and subscribe to remote vehicle data
 */
export default function useVehicleData(
    filter: Filter,
    subscriptionOptions: SubscriptionOptions,
    options: Options,
): IReturn {
    const [state, dispatch] = useVehicleReducer(options)
    const { uniqueLines } = useStopPlacesWithLines()
    const [settings] = useSettingsContext()
    const { hiddenRealtimeDataLineRefs } = settings || {}
    const [realtimeVehicles, setRealtimeVehicles] = useState<
        RealtimeVehicle[] | undefined
    >(undefined)
    const [allLinesWithRealtimeData, setAllLinesWithRealtimeData] = useState<
        string[] | undefined
    >(undefined)

    const filterVehiclesByLineRefs = useCallback(
        (vehiclesUpdates: RealtimeVehicle[] | undefined) => {
            if (!(vehiclesUpdates && uniqueLines)) {
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
        [uniqueLines, hiddenRealtimeDataLineRefs],
    )

    const handleQueryData = useCallback(
        ({ vehicles }: QueryData) => {
            setAllLinesWithRealtimeData(
                new Array(
                    ...new Set<string>(
                        vehicles.map((el: RealtimeVehicle) => el.line.lineRef),
                    ),
                ),
            )
            const filteredUpdates = filterVehiclesByLineRefs(vehicles)
            if (filteredUpdates && filteredUpdates?.length > 0)
                dispatch({
                    type: ActionType.HYDRATE,
                    payload: filteredUpdates,
                })
        },
        [dispatch, filterVehiclesByLineRefs],
    )

    const handleSubscriptionData = useCallback(
        ({ subscriptionData: { data } }: OnSubscriptionDataOptions) => {
            const { vehicleUpdates } = data
            if (vehicleUpdates.length > 0) {
                const filteredUpdates = filterVehiclesByLineRefs(vehicleUpdates)
                if (filteredUpdates)
                    dispatch({
                        type: ActionType.UPDATE,
                        payload: filteredUpdates,
                    })
            }
        },
        [dispatch, filterVehiclesByLineRefs],
    )

    useQuery<QueryData>(VEHICLES_QUERY, {
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: filter,
        skip: !uniqueLines,
        onCompleted: handleQueryData,
    })

    useSubscription<SubscriptionData>(VEHICLE_UPDATES_SUBSCRIPTION, {
        fetchPolicy: DEFAULT_FETCH_POLICY,
        variables: {
            ...filter,
            ...subscriptionOptions,
        },
        onSubscriptionData: handleSubscriptionData,
    })

    useEffect(() => {
        const mappedDataFromBothAPIs = (
            Object.values(state.vehicles) as RealtimeVehicle[]
        ).map((vehicle) => {
            const line = uniqueLines?.find((l) => l.id === vehicle.line.lineRef)
            return {
                ...vehicle,
                line: { ...vehicle.line, publicCode: line?.publicCode },
            }
        })
        setRealtimeVehicles(mappedDataFromBothAPIs)
    }, [state, uniqueLines])

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch({ type: ActionType.SWEEP })
        }, options.sweepIntervalMs ?? 1000)

        return () => {
            clearInterval(interval)
        }
    }, [dispatch, options.sweepIntervalMs])

    return { realtimeVehicles, allLinesWithRealtimeData }
}
