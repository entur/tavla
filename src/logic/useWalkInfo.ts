import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'
import { gql } from '@apollo/client'
import { Coordinates } from '@entur/sdk'
import { apolloClient } from '../service'
import { useSettingsContext } from '../settings'
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

type PlaceLocation = {
    name?: string
    place: string
}

type CoordinatesLocation = {
    name?: string
    coordinates: {
        latitude: number
        longitude: number
    }
}

type Location = PlaceLocation | CoordinatesLocation

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

type Destination = Location & {
    id: string
}

export type WalkInfo = {
    stopId: string
    walkTime: number
    walkDistance: number
}

function pick<T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
): Pick<T, K> {
    return Object.keys(obj).reduce((acc, key) => {
        const k = key as K
        if (!keys.includes(k)) {
            return acc
        }
        return {
            ...acc,
            [k]: obj[k],
        }
    }, {} as Pick<T, K>)
}

async function getWalkInfo(
    destinations: Destination[],
    from: Coordinates,
): Promise<WalkInfo[]> {
    const travelTimes = await Promise.all(
        destinations.map(async (destination) => {
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
                    to:
                        'place' in destination
                            ? pick(destination, ['name', 'place'])
                            : pick(destination, ['name', 'coordinates']),
                },
            })

            const tripPattern: WalkInfoTripPattern | undefined =
                data.trip.tripPatterns[0]

            if (!tripPattern) return

            return {
                stopId: destination.id,
                walkTime: tripPattern.duration,
                walkDistance: tripPattern.walkDistance,
            }
        }),
    )

    return travelTimes.filter(isNotNullOrUndefined)
}

const EMPTY_WALK_INFO: WalkInfo[] = []

export default function useWalkInfo(destinations: Destination[]): WalkInfo[] {
    const [settings] = useSettingsContext()
    const [travelTime, setTravelTime] = useState<WalkInfo[]>(EMPTY_WALK_INFO)

    const { latitude: fromLatitude, longitude: fromLongitude } =
        settings?.coordinates ?? {
            latitude: 0,
            longitude: 0,
        }

    const ids = destinations?.map((stopPlace) => stopPlace.id)
    const previousIds = usePrevious(ids)
    useEffect(() => {
        let aborted = false
        if (!destinations) {
            return setTravelTime(EMPTY_WALK_INFO)
        }
        if (!isEqual(ids, previousIds)) {
            getWalkInfo(destinations, {
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
    }, [fromLatitude, fromLongitude, ids, previousIds, destinations])

    return travelTime
}
