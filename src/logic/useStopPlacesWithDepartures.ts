import { useCallback, useEffect, useMemo, useState } from 'react'

import { gql } from '@apollo/client'
import { differenceInMinutes, format, parseISO } from 'date-fns'

import { TransportMode, TransportSubmode } from '@entur/sdk'

import { LineData, StopPlaceWithDepartures } from '../types'
import { isNotNullOrUndefined, nonEmpty, unique } from '../utils'
import { apolloClient } from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL } from '../constants'

import useNearestPlaces from './useNearestPlaces'

const GET_STOP_PLACES_WITH_DEPARTURES_QUERY = gql`
    query getStopPlacesWithDepartures($ids: [String]!) {
        stopPlaces(ids: $ids) {
            id
            name
            description
            latitude
            longitude
            transportMode
            transportSubmode
            estimatedCalls(
                numberOfDepartures: 200
                timeRange: 172800
                numberOfDeparturesPerLineAndDestinationDisplay: 20
                arrivalDeparture: departures
            ) {
                aimedDepartureTime
                cancellation
                date
                destinationDisplay {
                    frontText
                }
                expectedDepartureTime
                quay {
                    id
                    name
                    publicCode
                }
                serviceJourney {
                    id
                    journeyPattern {
                        line {
                            publicCode
                            transportMode
                        }
                    }
                    transportSubmode
                }
                situations {
                    summary {
                        value
                    }
                }
            }
        }
    }
`

type GetStopPlacesWithDeparturesVariables = {
    ids: string[]
}

type EstimatedCall = {
    date: string
    expectedDepartureTime: string
    aimedDepartureTime: string
    destinationDisplay: {
        frontText: string
    }
    serviceJourney: {
        id: string
        journeyPattern: {
            line: {
                publicCode: string
                transportMode: TransportMode
            }
        }
        transportSubmode: TransportSubmode
    }
    situations: Array<{
        summary: Array<{
            value: string
        }>
    }>
    cancellation: boolean
    quay: {
        id: string
        name: string
        publicCode: string
    }
}

type GetStopPlacesWithDeparturesResponse = {
    stopPlaces: Array<null | {
        id: string
        name: string
        description?: string
        latitude?: number
        longitude?: number
        transportMode: string
        transportSubmode: string
        estimatedCalls: EstimatedCall[]
    }>
}

async function fetchStopPlaceDepartures(
    allStopPlaceIdsWithoutDuplicateNumber: string[],
): Promise<
    Array<NonNullable<GetStopPlacesWithDeparturesResponse['stopPlaces'][0]>>
> {
    const { data } = await apolloClient.query<
        GetStopPlacesWithDeparturesResponse,
        GetStopPlacesWithDeparturesVariables
    >({
        query: GET_STOP_PLACES_WITH_DEPARTURES_QUERY,
        variables: {
            ids: allStopPlaceIdsWithoutDuplicateNumber,
        },
        fetchPolicy: 'network-only',
    })

    return data.stopPlaces
        .filter(isNotNullOrUndefined)
        .sort((a, b) => a.name.localeCompare(b.name, 'no'))
}

function formatDeparture(minDiff: number, departureTime: Date): string {
    if (minDiff > 15) return format(departureTime, 'HH:mm')
    return minDiff < 1 ? 'Nå' : `${minDiff} min`
}
function transformDepartureToLineData(
    departure: EstimatedCall,
): LineData | null {
    const {
        date,
        expectedDepartureTime,
        aimedDepartureTime,
        destinationDisplay,
        serviceJourney,
        situations,
        cancellation,
        quay,
    } = departure

    const { line } = serviceJourney.journeyPattern || {}

    if (!line) return null

    const departureTime = parseISO(expectedDepartureTime)
    const minDiff = differenceInMinutes(departureTime, new Date())

    const route = `${line.publicCode || ''} ${
        destinationDisplay.frontText
    }`.trim()

    const transportMode: TransportMode =
        line.transportMode === 'coach' ? TransportMode.BUS : line.transportMode
    const subType = serviceJourney?.transportSubmode

    return {
        id: `${date}::${aimedDepartureTime}::${serviceJourney.id}`,
        expectedDepartureTime,
        type: transportMode,
        subType,
        time: formatDeparture(minDiff, departureTime),
        departureTime,
        route,
        situation: situations[0]?.summary?.[0]?.value,
        hasCancellation: cancellation,
        quay,
    }
}

const EMPTY_STOP_PLACES_WITH_DEPARTURES: StopPlaceWithDepartures[] = []

export default function useStopPlacesWithDepartures():
    | StopPlaceWithDepartures[]
    | undefined {
    const [settings] = useSettingsContext()

    const nearestPlaces = useNearestPlaces(
        settings?.coordinates,
        settings?.distance,
    )
    const [stopPlacesWithDepartures, setStopPlacesWithDepartures] = useState<
        StopPlaceWithDepartures[] | undefined
    >()

    const {
        newStops = [],
        hiddenStops,
        hiddenStopModes,
        hiddenRoutes,
        hiddenModes,
    } = settings || {}

    const nearestStopPlaces = useMemo(
        () =>
            nearestPlaces
                .filter(({ type }) => type === 'StopPlace')
                .map(({ id }) => id),
        [nearestPlaces],
    )

    const allStopPlaceIds = useMemo(
        () =>
            unique([...newStops, ...nearestStopPlaces]).filter(
                (id) => !hiddenStops?.includes(id),
            ),
        [newStops, hiddenStops, nearestStopPlaces],
    )

    const formatStopPlacesWithDepartures = useCallback(
        (
            stopsAndDepartures: Array<
                NonNullable<
                    GetStopPlacesWithDeparturesResponse['stopPlaces'][0]
                >
            >,
        ): StopPlaceWithDepartures[] => {
            const formattedStopPlacesWithDepartures = allStopPlaceIds.map(
                (stopId) => {
                    const stop = stopsAndDepartures.find(
                        ({ id }) => id === stopId.replace(/-\d+$/, ''),
                    )

                    if (!stop) return

                    const mappedAndFilteredDepartures = nonEmpty(
                        stop.estimatedCalls
                            .map(transformDepartureToLineData)
                            .filter(isNotNullOrUndefined)
                            .filter(
                                ({ route, type }) =>
                                    !hiddenRoutes?.[stopId]?.includes(route) &&
                                    !hiddenStopModes?.[stopId]?.includes(
                                        type as unknown as TransportMode,
                                    ),
                            ),
                    )

                    if (!mappedAndFilteredDepartures) return undefined

                    return {
                        ...stop,
                        departures: mappedAndFilteredDepartures,
                    }
                },
            )

            return formattedStopPlacesWithDepartures.filter(
                isNotNullOrUndefined,
            )
        },
        [allStopPlaceIds, hiddenRoutes, hiddenStopModes],
    )

    useEffect(() => {
        const isDisabled = Boolean(hiddenModes?.includes('kollektiv'))

        let aborted = false

        if (isDisabled) {
            return setStopPlacesWithDepartures(
                EMPTY_STOP_PLACES_WITH_DEPARTURES,
            )
        }

        const fetchAndSet = () =>
            fetchStopPlaceDepartures(allStopPlaceIds).then((result) => {
                if (!aborted) {
                    setStopPlacesWithDepartures(
                        formatStopPlacesWithDepartures(result),
                    )
                }
            })

        if (nearestPlaces.length) {
            fetchAndSet()
        }

        const intervalId = setInterval(fetchAndSet, REFRESH_INTERVAL)

        return (): void => {
            clearInterval(intervalId)
            aborted = true
        }
    }, [
        nearestPlaces,
        allStopPlaceIds,
        formatStopPlacesWithDepartures,
        hiddenModes,
        settings,
    ])

    return stopPlacesWithDepartures
}
