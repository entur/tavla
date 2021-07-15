import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'

import { Coordinates, QueryMode } from '@entur/sdk'

import service from '../service'
import { useSettingsContext } from '../settings'
import { StopPlaceWithDepartures } from '../types'
import { usePrevious, isNotNullOrUndefined } from '../utils'

export type WalkInfo = {
    stopId: string
    walkTime: number
    walkDistance: number
}

async function getWalkInfo(
    stopPlaces: StopPlaceWithDepartures[],
    from: Coordinates,
): Promise<WalkInfo[]> {
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

export default function useTravelTime(
    stopPlaces: StopPlaceWithDepartures[] | null,
): WalkInfo[] | null {
    const [settings] = useSettingsContext()
    const [travelTime, setTravelTime] = useState<WalkInfo[] | null>(null)

    const { latitude: fromLatitude, longitude: fromLongitude } =
        settings?.coordinates ?? {
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
            getWalkInfo(stopPlaces, {
                latitude: fromLatitude,
                longitude: fromLongitude,
            }).then(setTravelTime)
        }
    }, [fromLatitude, fromLongitude, ids, previousIds, stopPlaces])

    return travelTime
}
