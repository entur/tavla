import { useState, useEffect, useMemo } from 'react'
import { BikeRentalStation, LegMode } from '@entur/sdk'

import { StopPlaceWithDepartures } from './types'
import { getPositionFromUrl, transformDepartureToLineData } from './utils'
import service from './service'
import { useSettingsContext, Settings } from './settings'

async function fetchBikeRentalStations(settings: Settings): Promise<Array<BikeRentalStation> | null> {
    const position = getPositionFromUrl()

    const {
        newStations, distance, hiddenStations, hiddenModes,
    } = settings

    if (hiddenModes.includes('bicycle')) {
        return null
    }

    const [newBikeStations, geoBikeStations] = await Promise.all([
        newStations.length ? service.getBikeRentalStations(newStations) : [],
        service.getBikeRentalStationsByPosition(position, distance),
    ])

    // TODO: Filter duplicates
    return [...newBikeStations, ...geoBikeStations]
        .filter(({ id }) => !hiddenStations.includes(id))
        .sort((a, b) => a.name.localeCompare(b.name, 'no'))
}

export function useBikeRentalStations(): Array<BikeRentalStation> | null {
    const [settings] = useSettingsContext()
    const [bikeRentalStations, setBikeRentalStations] = useState<Array<BikeRentalStation> | null>([])

    useEffect(() => {
        fetchBikeRentalStations(settings).then(setBikeRentalStations)
        const intervalId = setInterval(() => {
            fetchBikeRentalStations(settings).then(setBikeRentalStations)
        }, 30000)

        return (): void => clearInterval(intervalId)
    }, [settings])

    return bikeRentalStations
}

async function fetchStopPlaceDepartures(settings: Settings, nearestStopPlaces: Array<string>): Promise<Array<StopPlaceWithDepartures>> {
    const {
        newStops, hiddenStops, hiddenModes, hiddenRoutes,
    } = settings

    const [newStopPlaces, geoStopPlaces] = await Promise.all([
        Promise.all(newStops.map((stopId) => service.getStopPlace(stopId))),
        service.getStopPlaces(nearestStopPlaces),
    ])

    // TODO: Filter duplicates
    const allStopPlaces = [...newStopPlaces, ...geoStopPlaces]
        .filter(({ id }) => !hiddenStops.includes(id))
        .sort((a, b) => a.name.localeCompare(b.name, 'no'))

    const stopIds = allStopPlaces.map(({ id }) => id)

    const whiteListedModes = Object.values(LegMode).filter((mode: LegMode) => !hiddenModes.includes(mode))

    const departures = await service.getDeparturesFromStopPlaces(stopIds, {
        includeNonBoarding: false,
        departures: 50,
        whiteListedModes,
    })

    const stopPlacesWithDepartures = allStopPlaces.map(stop => {
        const departuresForThisStopPlace = departures.find(({ id }) => stop.id === id)
        if (!departuresForThisStopPlace || !departuresForThisStopPlace.departures) {
            return stop
        }
        return {
            ...stop,
            departures: departuresForThisStopPlace.departures
                .map(transformDepartureToLineData)
                .filter(({ name }) => !hiddenRoutes.includes(name)),
        }
    })

    return stopPlacesWithDepartures
}

export function useStopPlacesWithDepartures(): Array<StopPlaceWithDepartures> {
    const position = useMemo(() => getPositionFromUrl(), [])
    const [settings] = useSettingsContext()
    const [stopPlacesWithDepartures, setStopPlacesWithDepartures] = useState<Array<StopPlaceWithDepartures>>([])

    const [nearestStopPlaces, setNearestStopPlaces] = useState<Array<string>>([])

    useEffect(() => {
        service.getNearestPlaces(position, {
            maximumDistance: settings.distance,
            filterByPlaceTypes: ['StopPlace'],
            multiModalMode: 'parent',
        }).then(places => setNearestStopPlaces(places.map(({ id }) => id)))
    }, [position, settings.distance])

    useEffect(() => {
        fetchStopPlaceDepartures(settings, nearestStopPlaces).then(setStopPlacesWithDepartures)
        const intervalId = setInterval(() => {
            fetchStopPlaceDepartures(settings, nearestStopPlaces).then(setStopPlacesWithDepartures)
        }, 30000)

        return (): void => clearInterval(intervalId)
    }, [nearestStopPlaces, settings])

    return stopPlacesWithDepartures
}
