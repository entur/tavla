import { useApolloClient } from '@apollo/client'
import type { FetchResult } from '@apollo/client'
import { useEffect } from 'react'

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
): State {
    const [state, dispatch] = useVehicleReducer(options)
    const client = useApolloClient()

    /**
     * Query once to hydrate vehicle data
     */
    useEffect(() => {
        async function hydrate() {
            const { data: hydrationData } = await client.query({
                query: VEHICLES_QUERY,
                fetchPolicy: DEFAULT_FETCH_POLICY,
                variables: filter,
            })
            if (hydrationData && hydrationData.vehicles) {
                dispatch({
                    type: ActionType.HYDRATE,
                    payload: hydrationData.vehicles,
                })
            }
        }
        hydrate()
    }, [client, dispatch, filter])

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
                        dispatch({
                            type: ActionType.UPDATE,
                            payload: fetchResult?.data
                                ?.vehicleUpdates as Vehicle[],
                        })
                    }
                })

            return () => {
                subscription.unsubscribe()
            }
        }
    }, [client, dispatch, filter, subscriptionOptions])

    /**
     * Set a timer to swipe through vehicles to update their status
     */
    useEffect(() => {
        const timer = setInterval(() => {
            dispatch({ type: ActionType.SWEEP })
        }, options.sweepIntervalMs)

        return () => {
            clearInterval(timer)
        }
    }, [dispatch, options.sweepIntervalMs])

    return state
}
