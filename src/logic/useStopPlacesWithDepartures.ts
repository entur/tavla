import { useState, useEffect, useMemo, useCallback } from 'react'
import { isEqual } from 'lodash'

import { StopPlaceDetails, DeparturesById, LegMode } from '@entur/sdk'

import { StopPlaceWithDepartures } from '../types'
import {
    transformDepartureToLineData,
    unique,
    isNotNullOrUndefined,
    usePrevious,
} from '../utils'
import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL } from '../constants'

import useNearestPlaces from './useNearestPlaces'

async function fetchStopPlaceDepartures(
    allStopPlaceIdsWithoutDuplicateNumber: string[],
): Promise<{
    sortedStops: StopPlaceDetails[]
    departures: Array<DeparturesById | undefined>
}> {
    const allStopPlaces = await service.getStopPlaces(
        allStopPlaceIdsWithoutDuplicateNumber,
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

    const isDisabled = Boolean(hiddenModes?.includes('kollektiv'))

    const allStopPlaceIds = unique([...newStops, ...nearestStopPlaces]).filter(
        (id) => !hiddenStops?.includes(id),
    )

    const allStopPlaceIdsWithoutDuplicateNumber = allStopPlaceIds.map((id) =>
        id.replace(/-\d+$/, ''),
    )

    const prevStopPlaceIdsWithoutDuplicateNumber = usePrevious(
        allStopPlaceIdsWithoutDuplicateNumber,
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
                                        type as unknown as LegMode,
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
        const isStopPlacesEqual = isEqual(
            allStopPlaceIdsWithoutDuplicateNumber,
            prevStopPlaceIdsWithoutDuplicateNumber,
        )
        if (isDisabled) {
            return setStopPlacesWithDepartures(null)
        }
        if (!isStopPlacesEqual) {
            fetchStopPlaceDepartures(allStopPlaceIds)
                .then(formatStopPlacesWithDepartures)
                .then(setStopPlacesWithDepartures)
        }
        const intervalId = setInterval(() => {
            fetchStopPlaceDepartures(allStopPlaceIds)
                .then(formatStopPlacesWithDepartures)
                .then(setStopPlacesWithDepartures)
        }, REFRESH_INTERVAL)

        return (): void => clearInterval(intervalId)
    }, [
        allStopPlaceIds,
        allStopPlaceIdsWithoutDuplicateNumber,
        formatStopPlacesWithDepartures,
        isDisabled,
        prevStopPlaceIdsWithoutDuplicateNumber,
    ])

    return stopPlacesWithDepartures
}
