import { VehicleMapPoint } from './../services/model/vehicleMapPoint'
import { useApolloClient } from '@apollo/client'
import type { FetchResult } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'

import { Options } from '../services/model/options'

import { Filter } from '../services/model/filter'
import { Vehicle } from '../services/model/vehicle'
import { SubscriptionOptions } from '../services/model/subscriptionOptions'

import {
    VEHICLES_QUERY,
    VEHICLE_UPDATES_SUBSCRIPTION,
} from '../services/graphql'

import { useSettingsContext } from '../settings'

import {
    IResponse,
    ITest,
    testClient,
    TEST_QUERY,
} from '../components/Map/test'
import { getStopPlacesWithLines } from '../service'
import { StopPlaceWithLines } from '../types'

import useVehicleReducer, { ActionType, State } from './useVehicleReducer'

import { useStopPlacesWithDepartures } from '.'

const DEFAULT_FETCH_POLICY = 'no-cache'

export interface LiveVehicle {
    vehicle: Vehicle
    lineIdentifier: string //e.g. 12 or B21
    destination: string //e.g Kjelsås or Voksen skog
    mode: string // bus, tram etc.
    lineRef: string
    lineName: string
}

/**
 * Hook to query and subscribe to remote vehicle data
 */
export default function useVehicleData(
    filter: Filter,
    subscriptionOptions: SubscriptionOptions,
    options: Options,
): LiveVehicle[] | undefined {
    const [state, dispatch] = useVehicleReducer(options)
    const client = useApolloClient()
    const [settings] = useSettingsContext()
    const stopPlaces = useStopPlacesWithDepartures()
    console.log(stopPlaces)

    const [uniqueLineIds, setUniqueLineIds] = useState<string[] | undefined>(
        undefined,
    )

    const [usableState, setUsableState] = useState<LiveVehicle[] | undefined>(
        undefined,
    )

    const [lines, setLineNumberMapping] = useState<ITest[] | undefined>(
        undefined,
    )

    useEffect(() => {
        const nice = (Object.values(state.vehicles) as VehicleMapPoint[]).map(
            (vmp) => {
                const v = vmp.vehicle
                const line = lines?.find((l) => l.id === v.line.lineRef)
                return {
                    vehicle: v,
                    lineIdentifier: line?.journeyPatterns[0].line.publicCode,
                    destination: v.line.lineName.split('=> ').pop(),
                    lineRef: v.line.lineRef,
                    lineName: v.line.lineName,
                    mode: v.mode,
                } as LiveVehicle
            },
        )
        setUsableState(nice)
    }, [state, lines])

    useEffect(() => {
        const gln = async () => {
            //get line number short hand
            const { data } = await testClient.query<IResponse>({
                query: TEST_QUERY,
                fetchPolicy: 'no-cache',
                variables: { ids: uniqueLineIds },
            })
            if (data.lines.length > 0) {
                console.log(data.lines, 'lines')

                const mapping = data.lines
                setLineNumberMapping(mapping)
            }
        }
        if (uniqueLineIds) gln()
    }, [uniqueLineIds])

    useEffect(() => {
        console.log(stopPlaces)

        const abortController = new AbortController()
        const test = async () => {
            if (stopPlaces) {
                const stopPlacesWithLines: StopPlaceWithLines[] =
                    await getStopPlacesWithLines(
                        stopPlaces.map((sPlace) => sPlace.id),
                        abortController.signal,
                    )

                const lineIds: string[] = stopPlacesWithLines.flatMap((el) =>
                    el.lines.map((line) => line.id),
                )
                setUniqueLineIds(new Array(...new Set(lineIds)))
            }
        }
        test()
        return () => {
            abortController.abort()
        }
    }, [stopPlaces])

    const filterVehiclesByLineRefs = useCallback(
        (vehiclesUpdates: Vehicle[] | undefined) => {
            if (!(vehiclesUpdates && uniqueLineIds)) {
                return undefined
            }
            const filteredUpdates = vehiclesUpdates.filter((vehicle) =>
                uniqueLineIds.includes(vehicle.line.lineRef),
            )

            //&&
            // settings?.hiddenLiveDataLineRefs &&
            // !settings?.hiddenLiveDataLineRefs?.includes(
            //     vehicle.line.lineRef,
            // ),

            return filteredUpdates.length > 0 ? filteredUpdates : undefined
        },
        [uniqueLineIds, settings?.hiddenLiveDataLineRefs],
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
        if (uniqueLineIds) hydrate()
    }, [client, dispatch, filter, uniqueLineIds, filterVehiclesByLineRefs])

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
    return usableState
}
