import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'

import { BikeRentalStation, Coordinates, QueryMode } from '@entur/sdk'

import service from '../service'
import { useSettingsContext } from '../settings'
import { usePrevious, isNotNullOrUndefined } from '../utils'

export type WalkInfoBike = {
    stopId: string
    walkTime: number
    walkDistance: number
}

async function getWalkInfoBike(
    rentalStations: BikeRentalStation[], //bytte ut
    from: Coordinates, //gjøre noe her
): Promise<WalkInfoBike[]> {
    const travelTimes = await Promise.all(
        rentalStations.map((stopPlace) =>
            service
                .getTripPatterns({
                    from: {
                        name: 'pin',
                        coordinates: from,
                    },
                    to: {
                        name: stopPlace.name,
                        place: stopPlace.id,
                    },
                    modes: [QueryMode.FOOT],
                    limit: 1,
                })
                .then((result) => {
                    if (!result[0].duration || !result[0].walkDistance) {
                        return null
                    }
                    return {
                        stopId: stopPlace.id,
                        walkTime: result[0].duration,
                        walkDistance: result[0].walkDistance,
                    }
                })
                .catch(() => null),
        ),
    )

    return travelTimes.filter(isNotNullOrUndefined)
}

export default function useTravelTime( //endre litt
    rentalStations: BikeRentalStation[] | null,
): WalkInfoBike[] | null {
    const [settings] = useSettingsContext()
    const [travelTime, setTravelTime] = useState<WalkInfoBike[] | null>(null)

    const { latitude: fromLatitude, longitude: fromLongitude } =
        settings?.coordinates ?? {
            latitude: 0,
            longitude: 0,
        }

    const ids = rentalStations?.map((stopPlace) => stopPlace.id)
    const previousIds = usePrevious(ids)
    useEffect(() => {
        if (!rentalStations) {
            return setTravelTime(null)
        }
        if (!isEqual(ids, previousIds)) {
            getWalkInfoBike(rentalStations, {
                latitude: fromLatitude,
                longitude: fromLongitude,
            }).then(setTravelTime)
        }
    }, [fromLatitude, fromLongitude, ids, previousIds, rentalStations])

    return travelTime
}
