import createEnturService, { TransportMode, TransportSubmode } from '@entur/sdk'

import { StopPlaceWithLines, Line } from './types'
import { unique } from './utils'

const CLIENT_NAME = process.env.CLIENT_NAME || ''

if (!CLIENT_NAME && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(
        'CLIENT_NAME is missing! Please set a client name in your environment config.',
    )
}

export default createEnturService({
    clientName: CLIENT_NAME,
    hosts: {
        journeyPlanner: process.env.JOURNEYPLANNER_HOST,
        geocoder: process.env.GEOCODER_HOST,
        mobility: process.env.MOBILITY_HOST,
    },
})

function journeyplannerPost<T>(
    query: string,
    variables: Record<string, any>,
    signal: AbortSignal,
): Promise<T> {
    return fetch(`${process.env.JOURNEYPLANNER_HOST}/graphql`, {
        method: 'POST',
        headers: {
            'ET-Client-Name': CLIENT_NAME,
            'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({
            query,
            variables,
        }),
    }).then((res) => res.json())
}

interface EstimatedCall {
    destinationDisplay: {
        frontText: string
    }
    serviceJourney: {
        line: {
            id: string
            transportMode: TransportMode
            transportSubmode: TransportSubmode
            publicCode: string
        }
    }
}

interface StopPlaceWithEstimatedCalls {
    id: string
    name: string
    description: string
    latitude: number
    longitude: number
    transportMode: TransportMode
    transportSubmode: TransportSubmode
    estimatedCalls: EstimatedCall[]
}

function getNumericPublicCode(publicCode: string): number | void {
    const numberMatch = publicCode.match(/^\d+/)
    return numberMatch ? Number(numberMatch[0]) : undefined
}

function publicCodeComparator(a: string, b: string): number {
    const numA = getNumericPublicCode(a)
    const numB = getNumericPublicCode(b)
    if (typeof numA === 'number' && typeof numB === 'number') {
        return numA - numB
    }
    if (typeof numA === 'number') {
        return -1
    }
    if (typeof numB === 'number') {
        return 1
    }
    return a.localeCompare(b, 'no')
}

function estimatedCallsComparator(a: EstimatedCall, b: EstimatedCall): number {
    const publicCodeDiff = publicCodeComparator(
        a.serviceJourney.line.publicCode,
        b.serviceJourney.line.publicCode,
    )
    if (publicCodeDiff !== 0) {
        return publicCodeDiff
    }

    return a.destinationDisplay.frontText.localeCompare(
        b.destinationDisplay.frontText,
    )
}

export async function getStopPlacesWithLines(
    stopPlaceIds: string[],
    signal: AbortSignal,
): Promise<StopPlaceWithLines[]> {
    try {
        const variables = { ids: stopPlaceIds }
        const results = await journeyplannerPost<{
            data: { stopPlaces: StopPlaceWithEstimatedCalls[] }
        }>(
            `query ($ids: [String]!) {
                stopPlaces(ids: $ids) {
                    id,
                    name,
                    description,
                    latitude,
                    longitude,
                    transportMode,
                    transportSubmode,
                    estimatedCalls(numberOfDeparturesPerLineAndDestinationDisplay: 1, timeRange: 604800, numberOfDepartures:200, omitNonBoarding: true) {
                        destinationDisplay {
                            frontText
                        }
                        serviceJourney {
                            line {
                                id
                                transportMode,
                                transportSubmode,
                                publicCode
                            }
                        }
                    }
                }
            }
            `,
            variables,
            signal,
        )

        const stops: StopPlaceWithLines[] = results.data.stopPlaces.map(
            (stopPlace) => {
                const lines = stopPlace.estimatedCalls
                    .sort(estimatedCallsComparator)
                    .map(({ destinationDisplay, serviceJourney }) => ({
                        ...serviceJourney.line,
                        name: `${serviceJourney.line.publicCode} ${destinationDisplay.frontText}`,
                    }))

                const uniqueLines = unique(
                    lines,
                    (a: Line, b: Line) => a.name === b.name,
                )

                return {
                    ...stopPlace,
                    lines: uniqueLines,
                }
            },
        )

        return stops
    } catch (error) {
        return []
    }
}
