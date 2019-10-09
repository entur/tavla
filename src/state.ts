import { useState, useEffect } from 'react'
import { BikeRentalStation } from '@entur/sdk'

import { StopPlaceWithDepartures } from './types'
import { getPositionFromUrl, getSettingsFromUrl, transformDepartureToLineData } from './utils'
import service from './service'

async function fetchBikeRentalStations(): Promise<Array<BikeRentalStation> | null> {
    const position = getPositionFromUrl()
    const settings = getSettingsFromUrl()

    const {
        newStations, distance, hiddenStations, hiddenModes,
    } = settings

    if (hiddenModes.includes('bicycle')) {
        return null
    }

    const [newBikeStations, geoBikeStations] = await Promise.all([
        Promise.all(newStations.map(stationId => service.getBikeRentalStation(stationId))),
        service.getBikeRentalStations(position, distance),
    ])

    // TODO: Filter duplicates
    return [...newBikeStations, ...geoBikeStations]
        .filter(({ id }) => !hiddenStations.includes(id))
        .sort((a, b) => a.name.localeCompare(b.name, 'no'))
}

export function useBikeRentalStations(): Array<BikeRentalStation> | null {
    const [bikeRentalStations, setBikeRentalStations] = useState<Array<BikeRentalStation> | null>([])

    useEffect(() => {
        fetchBikeRentalStations().then(setBikeRentalStations)
        const intervalId = setInterval(() => {
            fetchBikeRentalStations().then(setBikeRentalStations)
        }, 30000)

        return (): void => clearInterval(intervalId)
    }, [])

    return bikeRentalStations
}

async function fetchStopPlaceDepartures(): Promise<Array<StopPlaceWithDepartures>> {
    const position = getPositionFromUrl()
    const settings = getSettingsFromUrl()

    const { newStops, distance, hiddenStops } = settings

    const [newStopPlaces, geoStopPlaces] = await Promise.all([
        Promise.all(newStops.map((stopId) => service.getStopPlace(stopId))),
        service.getStopPlacesByPosition(position, distance),
    ])

    // TODO: Filter duplicates
    const allStopPlaces = [...newStopPlaces, ...geoStopPlaces]
        .filter(({ id }) => !hiddenStops.includes(id))
        .sort((a, b) => a.name.localeCompare(b.name, 'no'))

    const stopIds = allStopPlaces.map(({ id }) => id)

    const departures = await service.getStopPlaceDepartures(stopIds, {
        includeNonBoarding: false,
        departures: 50,
    })

    const stopPlacesWithDepartures = allStopPlaces.map(stop => {
        const departuresForThisStopPlace = departures.find(({ id }) => stop.id === id)
        if (!departuresForThisStopPlace || !departuresForThisStopPlace.departures) {
            return stop
        }
        return {
            ...stop,
            departures: departuresForThisStopPlace.departures.map(transformDepartureToLineData),
        }
    })

    // .filter((route) => (
    //     !hiddenRoutes.includes(route)
    //     && !hiddenRoutes.some(hiddenRoute => hiddenRoute.includes(getCombinedStopPlaceAndRouteId(stopPlace.id, route)))
    // ))

    // if (hiddenModes.includes(routeType)) {
    //     return null
    // }

    return stopPlacesWithDepartures
}

export function useStopPlacesWithDepartures(): Array<StopPlaceWithDepartures> {
    const [stopPlacesWithDepartures, setStopPlacesWithDepartures] = useState<Array<StopPlaceWithDepartures>>([])

    useEffect(() => {
        fetchStopPlaceDepartures().then(setStopPlacesWithDepartures)
        const intervalId = setInterval(() => {
            fetchStopPlaceDepartures().then(setStopPlacesWithDepartures)
        }, 30000)

        return (): void => clearInterval(intervalId)
    }, [])

    return stopPlacesWithDepartures
}
