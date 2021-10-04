import { useState, useEffect, useMemo, useCallback } from 'react'

import { StopPlaceDetails, DeparturesById, TransportMode } from '@entur/sdk'

import { StopPlaceWithDepartures } from '../types'
import {
    transformDepartureToLineData,
    unique,
    isNotNullOrUndefined,
} from '../utils'
import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL } from '../constants'

import useNearestPlaces from './useNearestPlaces'

async function fetchStopPlaceDepartures(
    allStopPlaceIdsWithoutDuplicateNumber: string[],
    signal: AbortSignal,
): Promise<{
    sortedStops: StopPlaceDetails[]
    departures: Array<DeparturesById | undefined>
}> {
    const allStopPlaces = await service.getStopPlaces(
        allStopPlaceIdsWithoutDuplicateNumber,
        undefined,
        { signal },
    )
    const sortedStops = allStopPlaces
        .filter(isNotNullOrUndefined)
        .sort((a, b) => a.name.localeCompare(b.name, 'no'))

    const departures = await service.getDeparturesFromStopPlaces(
        allStopPlaceIdsWithoutDuplicateNumber,
        {
            includeNonBoarding: false,
            limit: 200,
            limitPerLine: 20,
        },
        { signal },
    )
    return { sortedStops, departures }
}

export default function useStopPlacesWithDepartures():
    | StopPlaceWithDepartures[]
    | null {
    const [settings] = useSettingsContext()

    const nearestPlaces = useNearestPlaces(
        settings?.coordinates,
        settings?.distance,
    )
    const [stopPlacesWithDepartures, setStopPlacesWithDepartures] = useState<
        StopPlaceWithDepartures[] | null
    >(null)

    const {
        newStops = [],
        hiddenStops,
        hiddenStopModes,
        hiddenRoutes,
        hiddenModes,
    } = settings || {}

    const nearestStopPlaces = useMemo(
        () =>
            nearestPlaces
                .filter(({ type }) => type === 'StopPlace')
                .map(({ id }) => id),
        [nearestPlaces],
    )

    const allStopPlaceIds = useMemo(
        () =>
            unique([...newStops, ...nearestStopPlaces]).filter(
                (id) => !hiddenStops?.includes(id),
            ),
        [newStops, hiddenStops, nearestStopPlaces],
    )

    const allStopPlaceIdsWithoutDuplicateNumber = useMemo(
        () => allStopPlaceIds.map((id) => id.replace(/-\d+$/, '')),
        [allStopPlaceIds],
    )

    const formatStopPlacesWithDepartures = useCallback(
        (stopsAndDepartures: {
            sortedStops: StopPlaceDetails[]
            departures: Array<DeparturesById | undefined>
        }): StopPlaceWithDepartures[] => {
            const formattedStopPlacesWithDepartures = allStopPlaceIds.map(
                (stopId) => {
                    const stop = stopsAndDepartures.sortedStops.find(
                        ({ id }) => id === stopId.replace(/-\d+$/, ''),
                    )

                    if (!stop) return

                    const departuresForThisStopPlace =
                        stopsAndDepartures.departures
                            .filter(isNotNullOrUndefined)
                            .find(({ id }) => stop.id === id)

                    if (
                        !departuresForThisStopPlace ||
                        !departuresForThisStopPlace.departures
                    ) {
                        return { ...stop, departures: [] }
                    }

                    const mappedAndFilteredDepartures =
                        departuresForThisStopPlace.departures
                            .map(transformDepartureToLineData)
                            .filter(isNotNullOrUndefined)
                            .filter(
                                ({ route, type }) =>
                                    !hiddenRoutes?.[stopId]?.includes(route) &&
                                    !hiddenStopModes?.[stopId]?.includes(
                                        type as unknown as TransportMode,
                                    ),
                            )
                    return {
                        ...stop,
                        id: stopId,
                        departures: mappedAndFilteredDepartures,
                    }
                },
            )

            return formattedStopPlacesWithDepartures.filter(
                isNotNullOrUndefined,
            )
        },
        [allStopPlaceIds, hiddenRoutes, hiddenStopModes],
    )

    useEffect(() => {
        const isDisabled = Boolean(hiddenModes?.includes('kollektiv'))

        const abortController = new AbortController()
        if (isDisabled) {
            return setStopPlacesWithDepartures(null)
        }
        if (nearestPlaces.length !== 0)
            fetchStopPlaceDepartures(allStopPlaceIds, abortController.signal)
                .then(formatStopPlacesWithDepartures)
                .then(setStopPlacesWithDepartures)
                .catch((error) => {
                    if (error.name !== 'AbortError') throw error
                })

        const intervalId = setInterval(() => {
            fetchStopPlaceDepartures(allStopPlaceIds, abortController.signal)
                .then(formatStopPlacesWithDepartures)
                .then(setStopPlacesWithDepartures)
                .catch((error) => {
                    if (error.name !== 'AbortError') throw error
                })
        }, REFRESH_INTERVAL)

        return (): void => {
            clearInterval(intervalId)
            abortController.abort()
        }
    }, [
        nearestPlaces,
        allStopPlaceIds,
        allStopPlaceIdsWithoutDuplicateNumber,
        formatStopPlacesWithDepartures,
        hiddenModes,
        settings,
    ])

    return stopPlacesWithDepartures
}
