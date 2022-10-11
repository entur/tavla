import { gql } from '@apollo/client'
import { TransportMode, TransportSubmode } from '@entur/sdk'
import { apolloClient } from '../service'
import { Line, StopPlaceWithLines } from '../types'
import { isNotNullOrUndefined, unique } from '../utils'

const STOP_PLACES_QUERY = gql`
    query getStopPlaces($ids: [String]!) {
        stopPlaces(ids: $ids) {
            id
            name
            description
            latitude
            longitude
            transportMode
            transportSubmode
            estimatedCalls(
                numberOfDeparturesPerLineAndDestinationDisplay: 1
                timeRange: 604800
                numberOfDepartures: 200
                arrivalDeparture: departures
            ) {
                destinationDisplay {
                    frontText
                }
                serviceJourney {
                    line {
                        id
                        transportMode
                        transportSubmode
                        publicCode
                    }
                    pointsOnLink {
                        points
                    }
                }
            }
        }
    }
`

type GetStopPlacesVariables = {
    ids: string[]
}

type GetStopPlacesResult = {
    stopPlaces: Array<{
        id: string
        name: string
        description: string
        latitude: number
        longitude: number
        transportMode: TransportMode
        transportSubmode: TransportSubmode
        estimatedCalls: EstimatedCall[]
    } | null>
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
        pointsOnLink?: {
            points: string
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
    stopPlaceIds: string[],
): Promise<StopPlaceWithLines[]> {
    const variables = { ids: stopPlaceIds }
    const { data } = await apolloClient.query<
        GetStopPlacesResult,
        GetStopPlacesVariables
    >({
        query: STOP_PLACES_QUERY,
        variables,
    })

    const stops: StopPlaceWithLines[] = data.stopPlaces
        .map((stopPlace) => {
            if (!stopPlace) {
                return
            }
            const lines = [...stopPlace.estimatedCalls]
                .sort(estimatedCallsComparator)
                .map(({ destinationDisplay, serviceJourney }) => ({
                    ...serviceJourney.line,
                    name: `${serviceJourney.line.publicCode} ${destinationDisplay.frontText}`,
                    pointsOnLink: serviceJourney.pointsOnLink?.points,
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
        .filter(isNotNullOrUndefined)

    return stops
}
