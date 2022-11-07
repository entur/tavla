import { useCallback, useEffect, useMemo, useState } from 'react'
import { differenceInMinutes, format, parseISO } from 'date-fns'
import { LineData, StopPlaceWithDepartures } from '../../types'
import { useSettings } from '../../settings/SettingsProvider'
import { REFRESH_INTERVAL } from '../../constants'
import { useNearestPlaces } from '../use-nearest-places/useNearestPlaces'
import { apolloClient } from '../../apollo-client'
import { isNotNullOrUndefined } from '../../utils/typeguards'
import { nonEmpty, unique } from '../../utils/array'
import {
    TransportMode,
    TransportSubmode,
} from '../../../graphql-generated/journey-planner-v3'
import GET_STOP_PLACES_WITH_DEPARTURES_QUERY from './GetStopPlacesWithDepartures.journey-planner.graphql'

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
        line.transportMode === 'coach' ? TransportMode.Bus : line.transportMode
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

function useStopPlacesWithDepartures(): StopPlaceWithDepartures[] | undefined {
    const [settings] = useSettings()

    const nearestPlaces = useNearestPlaces(
        settings.coordinates,
        settings.distance,
    )
    const [stopPlacesWithDepartures, setStopPlacesWithDepartures] = useState<
        StopPlaceWithDepartures[] | undefined
    >()

    const nearestStopPlaces = useMemo(
        () =>
            nearestPlaces
                .filter(({ type }) => type === 'StopPlace')
                .map(({ id }) => id),
        [nearestPlaces],
    )

    const allStopPlaceIds = useMemo(
        () =>
            unique([...settings.newStops, ...nearestStopPlaces]).filter(
                (id) => !settings.hiddenStops.includes(id),
            ),
        [settings.newStops, settings.hiddenStops, nearestStopPlaces],
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
                                    !settings.hiddenRoutes[stopId]?.includes(
                                        route,
                                    ) &&
                                    !settings.hiddenStopModes[stopId]?.includes(
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
        [allStopPlaceIds, settings.hiddenRoutes, settings.hiddenStopModes],
    )

    useEffect(() => {
        const isDisabled = Boolean(settings.hiddenModes.includes('kollektiv'))

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
        settings.hiddenModes,
    ])

    return stopPlacesWithDepartures
}

export { useStopPlacesWithDepartures }
