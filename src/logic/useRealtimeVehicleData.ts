import { useCallback, useEffect, useMemo, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import type { FetchResult } from '@apollo/client'
import { Filter } from '../services/realtimeVehicles/types/filter'
import { RealtimeVehicle } from '../services/realtimeVehicles/types/realtimeVehicle'
import {
    VEHICLES_QUERY,
    VEHICLE_UPDATES_SUBSCRIPTION,
} from '../services/realtimeVehicles/graphql'
import {
    SWEEP_INTERVAL_MS,
    DEFAULT_FETCH_POLICY,
    BUFFER_SIZE,
    BUFFER_TIME,
} from '../constants'
import { useSettingsContext } from '../settings'
import { useStopPlacesWithLines } from './useStopPlacesWithLines'
import useVehicleReducer, { ActionType } from './useRealtimeVehicleReducer'

interface Return {
    realtimeVehicles: RealtimeVehicle[] | undefined
    allLinesWithRealtimeData: string[] | undefined
}
interface QueryData {
    vehicles: RealtimeVehicle[]
}

/**
 * Hook to query and subscribe to remote vehicle data
 */
export default function useRealtimeVehicleData(filter?: Filter): Return {
    const client = useApolloClient()
    const [state, dispatch] = useVehicleReducer()
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
            if (
                !vehiclesUpdates ||
                !uniqueLines ||
                settings?.hideRealtimeData
            ) {
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
            setAllLinesWithRealtimeData([
                ...new Set<string>(
                    vehicles.map((el: RealtimeVehicle) => el.line.lineRef),
                ),
            ])
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
        variables: filter,
        skip: !uniqueLines,
        onCompleted: handleQueryData,
    })

    useEffect(() => {
        const subscription = client
            .subscribe({
                query: VEHICLE_UPDATES_SUBSCRIPTION,
                fetchPolicy: DEFAULT_FETCH_POLICY,
                variables: {
                    ...filter,
                    enableLiveUpdates: true,
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
    }, [client, filter, filterVehiclesByLineRefs, dispatch])

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch({ type: ActionType.SWEEP })
        }, SWEEP_INTERVAL_MS)

        return () => {
            clearInterval(interval)
        }
    }, [dispatch])

    const mappedDataFromBothAPIs = useMemo(
        () =>
            (Object.values(state.vehicles) as RealtimeVehicle[]).map(
                (vehicle) => {
                    const line = uniqueLines?.find(
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

    useEffect(() => {
        setRealtimeVehicles(mappedDataFromBothAPIs)
    }, [mappedDataFromBothAPIs])

    return { realtimeVehicles, allLinesWithRealtimeData }
}
