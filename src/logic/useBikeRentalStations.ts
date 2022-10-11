import { useEffect, useState } from 'react'
// Workaround for incompatible AbortSignal types between lib.dom and @entur/sdk
import { AbortSignal as AbortSignalNodeFetch } from 'node-fetch/externals'
import { Coordinates } from '@entur/sdk'
import { Station } from '@entur/sdk/lib/mobility/types'
import { enturClient } from '../service'
import { useSettingsContext } from '../settings'
import { createAbortController } from '../utils'

async function fetchBikeRentalStationsById(
    allStationIds: string[],
    signal?: AbortSignal,
): Promise<Station[]> {
    return await enturClient.mobility.getStationsById(
        {
            stationIds: allStationIds,
        },
        { signal: signal as AbortSignalNodeFetch },
    )
}

async function fetchBikeRentalStationsNearby(
    coordinates: Coordinates,
    distance: number,
    signal?: AbortSignal,
): Promise<Station[]> {
    return await enturClient.mobility.getStations(
        {
            lat: coordinates.latitude,
            lon: coordinates.longitude,
            range: distance,
        },
        { signal: signal as AbortSignalNodeFetch },
    )
}

const EMPTY_BIKE_RENTAL_STATIONS: Station[] = []

function useBikeRentalStations(
    removeHiddenStations = true,
): Station[] | undefined {
    const [settings] = useSettingsContext()
    const [bikeRentalStations, setBikeRentalStations] = useState<
        Station[] | undefined
    >(EMPTY_BIKE_RENTAL_STATIONS)
    const [nearbyStations, setNearbyStations] = useState<
        Station[] | undefined
    >()
    const [userSelectedStations, setUserSelectedStations] = useState<Station[]>(
        [],
    )

    const {
        coordinates,
        distance,
        newStations = [],
        hiddenStations = [],
        hiddenModes,
    } = settings || {}

    const isDisabled = Boolean(hiddenModes?.includes('bysykkel'))

    useEffect(() => {
        const abortController = createAbortController()
        if (!coordinates || !distance || isDisabled) {
            return setBikeRentalStations(EMPTY_BIKE_RENTAL_STATIONS)
        }
        fetchBikeRentalStationsNearby(
            coordinates,
            distance,
            abortController.signal,
        )
            .then((stations) => setNearbyStations(stations || []))
            .catch((error) => {
                if (error.name !== 'AbortError') throw error
            })

        return () => {
            abortController.abort()
        }
    }, [coordinates, distance, isDisabled])

    useEffect(() => {
        const abortController = createAbortController()
        if (isDisabled) {
            return setBikeRentalStations(EMPTY_BIKE_RENTAL_STATIONS)
        }
        fetchBikeRentalStationsById(newStations, abortController.signal)
            .then(setUserSelectedStations)
            .catch((error) => {
                if (error.name !== 'AbortError') throw error
            })
        return () => {
            abortController.abort()
        }
    }, [newStations, isDisabled])

    useEffect(() => {
        if (!nearbyStations) return

        if (isDisabled) {
            return setBikeRentalStations(EMPTY_BIKE_RENTAL_STATIONS)
        }
        const uniqueUserStations = userSelectedStations.filter(
            (userStation) =>
                !nearbyStations.some(
                    (nearbyStation) => nearbyStation.id === userStation.id,
                ),
        )
        setBikeRentalStations([...nearbyStations, ...uniqueUserStations])
    }, [nearbyStations, userSelectedStations, isDisabled])

    if (removeHiddenStations && bikeRentalStations) {
        return bikeRentalStations.filter(
            (station) => !hiddenStations.includes(station.id),
        )
    }

    return bikeRentalStations
}

export { useBikeRentalStations }
