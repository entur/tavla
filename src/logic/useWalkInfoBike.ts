import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'

import { Coordinates, QueryMode } from '@entur/sdk'
import { Station } from '@entur/sdk/lib/mobility/types'

import service from '../service'
import { useSettingsContext } from '../settings'
import { usePrevious, isNotNullOrUndefined } from '../utils'

export type WalkInfoBike = {
    stopId: string
    walkTime: number
    walkDistance: number
}

async function getWalkInfoBike(
    rentalStations: Station[],
    from: Coordinates,
    signal: AbortSignal,
): Promise<WalkInfoBike[]> {
    const travelTimes = await Promise.all(
        rentalStations.map((stopPlace) =>
            service
                .getTripPatterns(
                    {
                        from: {
                            name: 'pin',
                            coordinates: from,
                        },
                        to: {
                            coordinates: {
                                longitude: stopPlace.lon,
                                latitude: stopPlace.lat,
                            },
                        },
                        modes: [QueryMode.FOOT],
                        limit: 1,
                    },
                    undefined,
                    { signal },
                )
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
                .catch((err) => {
                    throw err
                }),
        ),
    )

    return travelTimes.filter(isNotNullOrUndefined)
}

export default function useTravelTime(
    rentalStations: Station[] | null,
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
        const abortController = new AbortController()
        if ((!isEqual(ids, previousIds) || !travelTime) && rentalStations) {
            getWalkInfoBike(
                rentalStations,
                {
                    latitude: fromLatitude,
                    longitude: fromLongitude,
                },
                abortController.signal,
            )
                .then(setTravelTime)
                .catch((err) => {
                    if (!abortController.signal.aborted) {
                        throw err
                    }
                })
        }
        return () => {
            abortController.abort()
        }
    }, [
        fromLatitude,
        fromLongitude,
        ids,
        previousIds,
        travelTime,
        rentalStations,
    ])

    return travelTime
}
