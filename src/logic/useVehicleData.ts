import { useApolloClient } from '@apollo/client'
import type { FetchResult } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'

import { Options } from '../services/model/options'

import { Filter } from '../services/model/filter'
import { Vehicle } from '../services/model/vehicle'
import { SubscriptionOptions } from '../services/model/subscriptionOptions'
import { useStopPlacesWithLines } from './useStopPlacesWithLines'
import { VehicleMapPoint } from './../services/model/vehicleMapPoint'

import {
    VEHICLES_QUERY,
    VEHICLE_UPDATES_SUBSCRIPTION,
} from '../services/graphql'

import { useSettingsContext } from '../settings'

import useVehicleReducer, { ActionType } from './useVehicleReducer'

const DEFAULT_FETCH_POLICY = 'no-cache'

export interface LiveVehicle {
    vehicle: Vehicle
    lineIdentifier: string //e.g. 12 or B21
    destination: string //e.g Kjelsås or Voksen skog
    mode: string // bus, tram etc.
    lineRef: string
    lineName: string
    active: boolean
}

interface VehicleData {
    liveVehicles: LiveVehicle[] | undefined
    allLiveLines: string[]
}

/**
 * Hook to query and subscribe to remote vehicle data
 */
export default function useVehicleData(
    filter: Filter,
    subscriptionOptions: SubscriptionOptions,
    options: Options,
): VehicleData {
    const [state, dispatch] = useVehicleReducer(options)
    const client = useApolloClient()

    const { uniqueLines } = useStopPlacesWithLines()
    const [settings] = useSettingsContext()
    const { hiddenLiveDataLineRefs } = settings || {}

    const [liveVehicles, setLiveVehicles] = useState<LiveVehicle[] | undefined>(
        undefined,
    )
    const [allLiveLines, setAllLiveLines] = useState<string[]>([])

    useEffect(() => {
        const nice = (Object.values(state.vehicles) as VehicleMapPoint[]).map(
            (vmp) => {
                const v = vmp.vehicle
                const line = uniqueLines?.find((l) => l.id === v.line.lineRef)
                return {
                    vehicle: v,
                    lineIdentifier: line?.publicCode,
                    destination: v.line.lineName.split('=> ').pop(),
                    lineRef: v.line.lineRef,
                    lineName: v.line.lineName,
                    mode: v.mode,
                    active: vmp.active,
                } as LiveVehicle
            },
        )
        setLiveVehicles(nice)
    }, [state, uniqueLines])

    const filterVehiclesByLineRefs = useCallback(
        (vehiclesUpdates: Vehicle[] | undefined) => {
            if (!(vehiclesUpdates && uniqueLines)) {
                return undefined
            }

            const filteredUpdates = vehiclesUpdates.filter(
                (vehicle) =>
                    uniqueLines
                        .map((line) => line.id)
                        .includes(vehicle.line.lineRef) &&
                    hiddenLiveDataLineRefs &&
                    !hiddenLiveDataLineRefs?.includes(vehicle.line.lineRef),
            )

            return filteredUpdates.length > 0 ? filteredUpdates : undefined
        },
        [uniqueLines, hiddenLiveDataLineRefs],
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
                setAllLiveLines(
                    new Array(
                        ...new Set<string>(
                            fetchResult?.data?.vehicles.map(
                                (el: Vehicle) => el.line.lineRef,
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
        }
        if (uniqueLines) hydrate()
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
    return { liveVehicles, allLiveLines }
}
