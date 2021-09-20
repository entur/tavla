import { useApolloClient } from '@apollo/client'
import type { FetchResult } from '@apollo/client'
import { useCallback, useEffect } from 'react'

import { Options } from '../services/model/options'

import { Filter } from '../services/model/filter'
import { Vehicle } from '../services/model/vehicle'
import { SubscriptionOptions } from '../services/model/subscriptionOptions'

import {
    VEHICLES_QUERY,
    VEHICLE_UPDATES_SUBSCRIPTION,
} from '../services/graphql'

import useVehicleReducer, { ActionType, State } from './useVehicleReducer'

const DEFAULT_FETCH_POLICY = 'no-cache'

/**
 * Hook to query and subscribe to remote vehicle data
 */
export default function useVehicleData(
    filter: Filter,
    subscriptionOptions: SubscriptionOptions,
    options: Options,
    lineRefs?: string[],
): State {
    const [state, dispatch] = useVehicleReducer(options)
    const client = useApolloClient()

    const filterVehiclesByLineRefs = useCallback(
        (vehiclesUpdates: Vehicle[] | undefined) => {
            if (!(vehiclesUpdates && lineRefs)) {
                return undefined
            }
            const filteredUpdates = vehiclesUpdates.filter((vehicle) =>
                lineRefs.includes(vehicle.line.lineRef),
            )

            return filteredUpdates.length > 0 ? filteredUpdates : undefined
        },
        [lineRefs],
    )

    /**
     * Query once to hydrate vehicle data
     */
    useEffect(() => {
        async function hydrate() {
            const fetchResult: FetchResult = await client.query({
                query: VEHICLES_QUERY,
                fetchPolicy: DEFAULT_FETCH_POLICY,
                variables: filter,
            })
            if (fetchResult.data && fetchResult.data.vehicles) {
                const filteredUpdates = filterVehiclesByLineRefs(
                    fetchResult?.data?.vehicles,
                )
                if (filteredUpdates && filteredUpdates?.length > 0)
                    dispatch({
                        type: ActionType.HYDRATE,
                        payload: filteredUpdates,
                    })
            }
        }
        if (lineRefs) hydrate()
    }, [client, dispatch, filter, lineRefs, filterVehiclesByLineRefs])

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

    /**
     * Set a timer to swipe through vehicles to update their status
     */
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         dispatch({ type: ActionType.SWEEP })
    //     }, options.sweepIntervalMs)

    //     return () => {
    //         clearInterval(timer)
    //     }
    // }, [dispatch, options.sweepIntervalMs])

    return state
}
