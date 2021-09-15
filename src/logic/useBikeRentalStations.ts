import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'
import { Coordinates } from '@entur/sdk'
import { Station } from '@entur/sdk/lib/mobility/types'

import { usePrevious } from '../utils'
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

export default function useBikeRentalStations(): Station[] | null {
    const [settings] = useSettingsContext()
    const [bikeRentalStations, setBikeRentalStations] = useState<
        Station[] | null
    >(null)
    const [nearbyStations, setStationsNearby] = useState<Station[]>([])
    const [additionalStations, setAdditionalStations] = useState<Station[]>([])

    const {
        coordinates,
        distance,
        newStations = [],
        hiddenStations = [],
        hiddenModes,
    } = settings || {}

    const prevNewStations = usePrevious(newStations)
    const prevArea = usePrevious({ coordinates, distance })

    const isDisabled = Boolean(hiddenModes?.includes('bysykkel'))
    useEffect(() => {
        if (!coordinates || !distance || isDisabled) {
            return setBikeRentalStations(null)
        }
        const isAreaChanged = !isEqual({ coordinates, distance }, prevArea)
        const isNewStationsAdded = !isEqual(newStations, prevNewStations)

        // 1. Add nearby stations
        // 2. Add additional stations
        // 3. Remove hidden stations

        if (isAreaChanged) {
            fetchBikeRentalStationsNearby(coordinates, distance).then(
                (stations) => setStationsNearby(stations || []),
            )
        }
        if (isNewStationsAdded) {
            fetchBikeRentalStationsById(newStations).then((stations) =>
                setAdditionalStations(stations || []),
            )
        }
        const allStations = [...nearbyStations, ...additionalStations]
        setBikeRentalStations(
            allStations.filter(
                (station) => !hiddenStations.includes(station.id),
            ),
        )
    }, [
        coordinates,
        distance,
        newStations,
        hiddenStations,
        nearbyStations,
        additionalStations,
        isDisabled,
        prevArea,
        prevNewStations,
    ])

    return bikeRentalStations
}
