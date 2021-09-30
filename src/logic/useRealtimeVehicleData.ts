import { useApolloClient } from '@apollo/client'
import type { FetchResult } from '@apollo/client'
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

export const defaultFilter: Filter = {
    monitored: true,
}

export const defaultSubscriptionOptions: SubscriptionOptions = {
    enableLiveUpdates: true,
    bufferSize: 100,
    bufferTime: 1000,
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
    const client = useApolloClient()

    const { uniqueLines } = useStopPlacesWithLines()
    const [settings] = useSettingsContext()
    const { hiddenRealtimeDataLineRefs } = settings || {}

    const [realtimeVehicles, setRealtimeVehicles] = useState<
        RealtimeVehicle[] | undefined
    >(undefined)
    const [allLinesWithRealtimeData, setAllLinesWithRealtimeData] = useState<
        string[] | undefined
    >(undefined)

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

    /**
     * Query once to hydrate vehicle data
     */
    useEffect(() => {
        const abortController = new AbortController()
        const hydrate = async () => {
            try {
                const fetchResult: FetchResult = await client.query({
                    query: VEHICLES_QUERY,
                    fetchPolicy: DEFAULT_FETCH_POLICY,
                    variables: filter,
                    context: {
                        fetchOptions: { signal: abortController.signal },
                    },
                })
                if (fetchResult.data && fetchResult.data.vehicles) {
                    setAllLinesWithRealtimeData(
                        new Array(
                            ...new Set<string>(
                                fetchResult?.data?.vehicles.map(
                                    (el: RealtimeVehicle) => el.line.lineRef,
                                ),
                            ),
                        ),
                    )
                    const filteredUpdates = filterVehiclesByLineRefs(
                        fetchResult?.data?.vehicles,
                    )
                    if (filteredUpdates && filteredUpdates?.length > 0)
                        dispatch({
                            type: ActionType.HYDRATE,
                            payload: filteredUpdates,
                        })
                }
            } catch (error) {
                if (!(error instanceof DOMException)) throw error
            }
        }
        if (uniqueLines) hydrate()
        return () => {
            abortController.abort()
        }
    }, [client, dispatch, filter, uniqueLines, filterVehiclesByLineRefs])

    /**
     * Set up subscription to receive updates on vehicles
     */
    useEffect(() => {
        /**
         * To avoid triggering re-renders too frequently, buffer subscription updates
         * and set a timer to dispatch the update on a given interval.
         */

        if (subscriptionOptions?.enableLiveUpdates) {
            const subscription = client
                .subscribe({
                    query: VEHICLE_UPDATES_SUBSCRIPTION,
                    fetchPolicy: DEFAULT_FETCH_POLICY,
                    variables: {
                        ...filter,
                        ...subscriptionOptions,
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
        }
    }, [
        client,
        dispatch,
        filter,
        subscriptionOptions,
        filterVehiclesByLineRefs,
    ])

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
