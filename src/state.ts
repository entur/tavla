import { useState, useEffect, useMemo } from 'react'
import { BikeRentalStation, LegMode, NearestPlace } from '@entur/sdk'

import { StopPlaceWithDepartures } from './types'
import { getPositionFromUrl, transformDepartureToLineData } from './utils'
import service from './service'
import { useSettingsContext, Settings } from './settings'

function useNearestPlaces(position, settings): Array<NearestPlace> {
    const [nearestPlaces, setNearestPlaces] = useState<Array<NearestPlace>>([])

    useEffect(() => {
        service.getNearestPlaces(position, {
            maximumDistance: settings.distance,
            filterByPlaceTypes: ['StopPlace', 'BikeRentalStation'],
            multiModalMode: 'parent',
        }).then(setNearestPlaces)
    }, [position, settings.distance])

    return nearestPlaces
}

async function fetchBikeRentalStations(settings: Settings, nearestBikeRentalStations: Array<string>): Promise<Array<BikeRentalStation> | null> {
    const {
        newStations, hiddenStations, hiddenModes,
    } = settings

    if (hiddenModes.includes('bicycle')) {
        return null
    }

    const allStationIds = [...newStations, ...nearestBikeRentalStations]
        .filter(id => !hiddenStations.includes(id))
        .filter((id, index, ids) => ids.indexOf(id) === index)

    const allStations = await service.getBikeRentalStations(allStationIds)
    return allStations.sort((a, b) => a.name.localeCompare(b.name, 'no'))
}

export function useBikeRentalStations(): Array<BikeRentalStation> | null {
    const position = useMemo(() => getPositionFromUrl(), [])
    const [settings] = useSettingsContext()
    const [bikeRentalStations, setBikeRentalStations] = useState<Array<BikeRentalStation> | null>([])
    const nearestPlaces = useNearestPlaces(position, settings)

    const nearestBikeRentalStations = useMemo(
        () => nearestPlaces
            .filter(({ type }) => type === 'BikeRentalStation')
            .map(({ id }) => id),
        [nearestPlaces]
    )

    useEffect(() => {
        fetchBikeRentalStations(settings, nearestBikeRentalStations).then(setBikeRentalStations)
        const intervalId = setInterval(() => {
            fetchBikeRentalStations(settings, nearestBikeRentalStations).then(setBikeRentalStations)
        }, 30000)

        return (): void => clearInterval(intervalId)
    }, [nearestBikeRentalStations, settings])

    return bikeRentalStations
}

async function fetchStopPlaceDepartures(settings: Settings, nearestStopPlaces: Array<string>): Promise<Array<StopPlaceWithDepartures>> {
    const {
        newStops, hiddenStops, hiddenModes, hiddenRoutes,
    } = settings

    const allStopPlaceIds = [...newStops, ...nearestStopPlaces]
        .filter(id => !hiddenStops.includes(id))
        .filter((id, index, ids) => ids.indexOf(id) === index)

    const allStopPlaces = await service.getStopPlaces(allStopPlaceIds)
    const sortedStops = allStopPlaces.sort((a, b) => a.name.localeCompare(b.name, 'no'))

    const whiteListedModes = Object.values(LegMode).filter((mode: LegMode) => !hiddenModes.includes(mode))

    const departures = await service.getDeparturesFromStopPlaces(allStopPlaceIds, {
        includeNonBoarding: false,
        departures: 50,
        whiteListedModes,
    })

    const stopPlacesWithDepartures = sortedStops.map(stop => {
        const departuresForThisStopPlace = departures.find(({ id }) => stop.id === id)
        if (!departuresForThisStopPlace || !departuresForThisStopPlace.departures) {
            return stop
        }
        return {
            ...stop,
            departures: departuresForThisStopPlace.departures
                .map(transformDepartureToLineData)
                .filter(({ route }) => !hiddenRoutes.includes(route)),
        }
    })

    return stopPlacesWithDepartures
}

export function useStopPlacesWithDepartures(): Array<StopPlaceWithDepartures> {
    const position = useMemo(() => getPositionFromUrl(), [])
    const [settings] = useSettingsContext()
    const nearestPlaces = useNearestPlaces(position, settings)
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
