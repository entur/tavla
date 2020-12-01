import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'

import { Coordinates, QueryMode } from '@entur/sdk'

import service from '../service'
import { useSettingsContext } from '../settings'
import { StopPlaceWithDepartures } from '../types'
import { usePrevious, isNotNullOrUndefined } from '../utils'

async function getWalkTime(
    stopPlaces: StopPlaceWithDepartures[],
    from: Coordinates,
): Promise<Array<{ stopId: string; walkTime: number }>> {
    const travelTimes = await Promise.all(
        stopPlaces.map((stopPlace) =>
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
                .then((result) => ({
                    stopId: stopPlace.id,
                    walkTime: result[0].duration,
                }))
                .catch(() => null),
        ),
    )

    return travelTimes.filter(isNotNullOrUndefined)
}

export default function useTravelTime(
    stopPlaces: StopPlaceWithDepartures[] | null,
): Array<{ stopId: string; walkTime: number }> | null {
    const [settings] = useSettingsContext()
    const [travelTime, setTravelTime] = useState<Array<{
        stopId: string
        walkTime: number
    }> | null>(null)

    const {
        latitude: fromLatitude,
        longitude: fromLongitude,
    } = settings?.coordinates ?? {
        latitude: 0,
        longitude: 0,
    }

    const ids = stopPlaces?.map((stopPlace) => stopPlace.id)
    const previousIds = usePrevious(ids)
    useEffect(() => {
        if (!stopPlaces) {
            return setTravelTime(null)
        }
        if (!isEqual(ids, previousIds)) {
            getWalkTime(stopPlaces, {
                latitude: fromLatitude,
                longitude: fromLongitude,
            }).then(setTravelTime)
        }
    }, [fromLatitude, fromLongitude, ids, previousIds, stopPlaces])

    return travelTime
}
