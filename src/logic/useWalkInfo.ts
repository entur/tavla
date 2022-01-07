import { useState, useEffect } from 'react'

import { isEqual } from 'lodash'

import { gql } from '@apollo/client'

import { Coordinates } from '@entur/sdk'

import { apolloClient } from '../service'
import { useSettingsContext } from '../settings'
import { StopPlaceWithDepartures } from '../types'
import { usePrevious, isNotNullOrUndefined } from '../utils'

const GET_WALK_INFO_QUERY = gql`
    query getWalkInfo($from: Location!, $to: Location!) {
        trip(
            from: $from
            to: $to
            modes: { directMode: foot }
            numTripPatterns: 1
        ) {
            tripPatterns {
                duration
                walkDistance
            }
        }
    }
`

type Location = {
    name?: string
    place?: string
    coordinates?: {
        latitude: number
        longitude: number
    }
}

type GetWalkInfoVariables = {
    from: Location
    to: Location
}

type WalkInfoTripPattern = {
    duration: number
    walkDistance: number
}

type GetWalkInfoResult = {
    trip: {
        tripPatterns: WalkInfoTripPattern[]
    }
}

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
        stopPlaces.map(async (stopPlace) => {
            const { data } = await apolloClient.query<
                GetWalkInfoResult,
                GetWalkInfoVariables
            >({
                query: GET_WALK_INFO_QUERY,
                variables: {
                    from: {
                        name: 'pin',
                        coordinates: from,
                    },
                    to: {
                        name: stopPlace.name,
                        place: stopPlace.id,
                    },
                },
            })

            const tripPattern: WalkInfoTripPattern | undefined =
                data.trip.tripPatterns[0]

            if (!tripPattern) return

            return {
                stopId: stopPlace.id,
                walkTime: tripPattern.duration,
                walkDistance: tripPattern.walkDistance,
            }
        }),
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
        let aborted = false
        if (!stopPlaces) {
            return setTravelTime(null)
        }
        if (!isEqual(ids, previousIds)) {
            getWalkInfo(stopPlaces, {
                latitude: fromLatitude,
                longitude: fromLongitude,
            }).then((info) => {
                if (!aborted) {
                    setTravelTime(info)
                }
            })
        }
        return () => {
            aborted = true
        }
    }, [fromLatitude, fromLongitude, ids, previousIds, stopPlaces])

    return travelTime
}
