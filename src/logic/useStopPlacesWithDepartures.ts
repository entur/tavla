import { useState, useEffect, useMemo } from 'react'
import { LegMode } from '@entur/sdk'

import { StopPlaceWithDepartures } from '../types'
import { getPositionFromUrl, transformDepartureToLineData, unique } from '../utils'
import service from '../service'
import { useSettingsContext, Settings } from '../settings'

import useNearestPlaces from './useNearestPlaces'

async function fetchStopPlaceDepartures(settings: Settings, nearestStopPlaces: Array<string>): Promise<Array<StopPlaceWithDepartures>> {
    const {
        newStops, hiddenStops, hiddenModes, hiddenRoutes,
    } = settings

    const allStopPlaceIds = unique([...newStops, ...nearestStopPlaces])
        .filter(id => !hiddenStops.includes(id))

    const allStopPlaceIdsWithoutDuplicateNumber = allStopPlaceIds.map(id => id.replace(/-\d+$/, ''))

    const allStopPlaces = await service.getStopPlaces(allStopPlaceIdsWithoutDuplicateNumber)
    const sortedStops = allStopPlaces.sort((a, b) => a.name.localeCompare(b.name, 'no'))

    const whiteListedModes = Object.values(LegMode).filter((mode: LegMode) => !hiddenModes.includes(mode))

    const departures = await service.getDeparturesFromStopPlaces(allStopPlaceIdsWithoutDuplicateNumber, {
        includeNonBoarding: false,
        departures: 50,
        whiteListedModes,
    })

    const stopPlacesWithDepartures = allStopPlaceIds.map(stopId => {
        const stop = sortedStops.find(({ id }) => id === stopId.replace(/-\d+$/, ''))
        const departuresForThisStopPlace = departures.find(({ id }) => stop.id === id)
        if (!departuresForThisStopPlace || !departuresForThisStopPlace.departures) {
            return stop
        }

        const mappedAndFilteredDepartures = departuresForThisStopPlace.departures
            .map(transformDepartureToLineData)
            .filter(({ route }) => !hiddenRoutes[stopId] || !hiddenRoutes[stopId].includes(route))

        return {
            ...stop,
            departures: mappedAndFilteredDepartures,
        }
    })

    return stopPlacesWithDepartures
}

export default function useStopPlacesWithDepartures(): Array<StopPlaceWithDepartures> {
    const position = useMemo(() => getPositionFromUrl(), [])
    const [settings] = useSettingsContext()
    const nearestPlaces = useNearestPlaces(position, settings.distance)
    const [stopPlacesWithDepartures, setStopPlacesWithDepartures] = useState<Array<StopPlaceWithDepartures>>([])

    const nearestStopPlaces = useMemo(
        () => nearestPlaces
            .filter(({ type }) => type === 'StopPlace')
            .map(({ id }) => id),
        [nearestPlaces]
    )

    useEffect(() => {
        fetchStopPlaceDepartures(settings, nearestStopPlaces).then(setStopPlacesWithDepartures)
        const intervalId = setInterval(() => {
            fetchStopPlaceDepartures(settings, nearestStopPlaces).then(setStopPlacesWithDepartures)
        }, 30000)

        return (): void => clearInterval(intervalId)
    }, [nearestStopPlaces, settings])

    return stopPlacesWithDepartures
}
