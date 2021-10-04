import { useState, useEffect } from 'react'
import { Coordinates } from '@entur/sdk'
import { Station } from '@entur/sdk/lib/mobility/types'

import service from '../service'
import { useSettingsContext } from '../settings'

async function fetchBikeRentalStationsById(
    allStationIds: string[],
    signal: AbortSignal,
): Promise<Station[] | null> {
    const allStations = await service.mobility.getStationsById(
        {
            stationIds: allStationIds,
        },
        { signal },
    )
    return allStations
}

async function fetchBikeRentalStationsNearby(
    coordinates: Coordinates,
    distance: number,
    signal: AbortSignal,
): Promise<Station[] | null> {
    const allStations = await service.mobility.getStations(
        {
            lat: coordinates.latitude,
            lon: coordinates.longitude,
            range: distance,
        },
        { signal },
    )
    return allStations
}

export default function useBikeRentalStations(
    removeHiddenStations = true,
): Station[] | null {
    const [settings] = useSettingsContext()
    const [bikeRentalStations, setBikeRentalStations] = useState<
        Station[] | null
    >(null)
    const [nearbyStations, setNearbyStations] = useState<Station[]>([])
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
        const abortController = new AbortController()
        if (!coordinates || !distance || isDisabled) {
            return setBikeRentalStations(null)
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
        const abortController = new AbortController()
        if (isDisabled) {
            return setBikeRentalStations(null)
        }
        fetchBikeRentalStationsById(newStations, abortController.signal)
            .then((stations) => setUserSelectedStations(stations || []))
            .catch((error) => {
                if (error.name !== 'AbortError') throw error
            })
        return () => {
            abortController.abort()
        }
    }, [newStations, isDisabled])

    useEffect(() => {
        if (isDisabled) {
            return setBikeRentalStations(null)
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
