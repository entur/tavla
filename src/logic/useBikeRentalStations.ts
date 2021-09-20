import { useState, useEffect } from 'react'
import { Coordinates } from '@entur/sdk'
import { Station } from '@entur/sdk/lib/mobility/types'

import service from '../service'
import { useSettingsContext } from '../settings'

async function fetchBikeRentalStationsById(
    allStationIds: string[],
): Promise<Station[] | null> {
    const allStations = await service.mobility.getStationsById({
        stationIds: allStationIds,
    })
    return allStations
}

async function fetchBikeRentalStationsNearby(
    coordinates: Coordinates,
    distance: number,
): Promise<Station[] | null> {
    const allStations = await service.mobility.getStations({
        lat: coordinates.latitude,
        lon: coordinates.longitude,
        range: distance,
    })
    return allStations
}

function includesStation(stations: Station[], station: Station) {
    for (let index = 0; index < stations.length; index++) {
        if (station.id === stations[index].id) return true
    }
    return false
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
        if (!coordinates || !distance || isDisabled) {
            return setBikeRentalStations(null)
        }
        fetchBikeRentalStationsNearby(coordinates, distance).then((stations) =>
            setNearbyStations(stations || []),
        )
    }, [coordinates, distance, isDisabled])

    useEffect(() => {
        if (isDisabled) {
            return setBikeRentalStations(null)
        }
        fetchBikeRentalStationsById(newStations).then((stations) =>
            setUserSelectedStations(stations || []),
        )
    }, [newStations, isDisabled])

    useEffect(() => {
        if (isDisabled) {
            return setBikeRentalStations(null)
        }
        const uniqueUserStations = userSelectedStations.filter(
            (station) => !includesStation(nearbyStations, station),
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
