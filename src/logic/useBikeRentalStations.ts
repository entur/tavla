import { useEffect, useState } from 'react'

import { Coordinates } from '@entur/sdk'
import { Station } from '@entur/sdk/lib/mobility/types'

import service from '../service'
import { useSettingsContext } from '../settings'

async function fetchBikeRentalStationsById(
    allStationIds: string[],
    signal?: AbortSignal,
): Promise<Station[]> {
    return await service.mobility.getStationsById(
        {
            stationIds: allStationIds,
        },
        { signal },
    )
}

async function fetchBikeRentalStationsNearby(
    coordinates: Coordinates,
    distance: number,
    signal?: AbortSignal,
): Promise<Station[]> {
    return await service.mobility.getStations(
        {
            lat: coordinates.latitude,
            lon: coordinates.longitude,
            range: distance,
        },
        { signal },
    )
}

export default function useBikeRentalStations2(
    excludeHiddenStations = true,
): Station[] {
    const [settings] = useSettingsContext()
    const [stations, setStations] = useState<Station[]>([])
    const [stationIds, setStationIds] = useState<string[]>([])

    const {
        coordinates,
        distance,
        newStations = [],
        hiddenStations = [],
        hiddenModes,
    } = settings || {}

    const isDisabled = Boolean(hiddenModes?.includes('bysykkel'))

    // Todo: check usememo for ids, memo on distance and coordinates
    useEffect(() => {
        if (!coordinates || !distance || isDisabled) return
        const abortController = new AbortController()

        fetchBikeRentalStationsNearby(
            coordinates,
            distance,
            abortController.signal,
        ).then((sts) => {
            setStationIds(sts.map((st) => st.id)) // Store IDs of all nearby stations
        })
    }, [coordinates, distance, isDisabled])

    function pollStationsById() {
        if (stationIds.length === 0 || isDisabled) return

        const abortController = new AbortController()

        const getData = () => {
            // Filter out IDs of hidden stations if excludeHiddenStations is true
            const stationsToFetch = excludeHiddenStations
                ? stationIds.filter((st) => !hiddenStations.includes(st))
                : stationIds

            const uniqueStationsToFetch = [
                ...new Set([...stationsToFetch, ...newStations]),
            ]

            fetchBikeRentalStationsById(
                uniqueStationsToFetch,
                abortController.signal,
            ).then((st) => {
                setStations(st)
            })
        }
        getData()

        const intervalId = setInterval(getData, 30000)
        return () => {
            // If connection is interrupted or updated, stop next poll
            // And send abort signal to cancel network request in case it is in progress
            clearInterval(intervalId)
            abortController.abort()
        }
    }
    useEffect(pollStationsById, [
        stationIds,
        hiddenStations,
        isDisabled,
        excludeHiddenStations,
        newStations,
    ])

    return stations
}
