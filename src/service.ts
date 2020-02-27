import EnturService from '@entur/sdk'

import { StopPlaceWithLines, Line } from './types'
import { unique } from './utils'

const CLIENT_NAME = 'entur-tavla'

export default new EnturService({
    clientName: CLIENT_NAME,
    hosts: {
        // @ts-ignore
        journeyplanner: process.env.JOURNEYPLANNER_HOST,
        // @ts-ignore
        geocoder: process.env.GEOCODER_HOST,
    },
})

function journeyplannerPost(query, variables): Promise<any> {
    // @ts-ignore
    return fetch(`${process.env.JOURNEYPLANNER_HOST}/graphql`, {
        method: 'POST',
        headers: {
            'ET-Client-Name': CLIENT_NAME,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    }).then(res => res.json())
}

interface EstimatedCall {
    destinationDisplay: {
        frontText: string
    }
    serviceJourney: {
        line: {
            transportMode: string
            transportSubmode: string
            publicCode: string
        }
    }
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
    stopPlaceIds: Array<string>,
): Promise<Array<StopPlaceWithLines>> {
    try {
        const variables = { ids: stopPlaceIds }
        const results = await journeyplannerPost(
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
        )

        const stops = results.data.stopPlaces.map(stopPlace => {
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
        })

        return stops
    } catch (error) {
        return []
    }
}
