import { useEffect, useState } from 'react'
// Workaround for incompatible AbortSignal types between lib.dom and @entur/sdk
import { AbortSignal as AbortSignalNodeFetch } from 'node-fetch/externals'
import { Coordinates } from '@entur/sdk'
import { Station } from '@entur/sdk/lib/mobility/types'
import { enturClient } from '../service'
import { useSettingsContext } from '../settings'

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

function useBikeRentalStations(excludeHiddenStations = true): Station[] {
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
            setStationIds(sts.map((st) => st.id))
        })
    }, [coordinates, distance, isDisabled])

    function pollStationsById() {
        if (stationIds.length === 0 || isDisabled) return

        const abortController = new AbortController()

        const getData = () => {
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

export { useBikeRentalStations }
