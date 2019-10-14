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

export async function getStopPlacesWithLines(stopPlaceIds: Array<string>): Promise<Array<StopPlaceWithLines>> {
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
                    estimatedCalls(numberOfDeparturesPerLineAndDestinationDisplay: 1, timeRange: 604800, numberOfDepartures:200) {
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
            variables
        )

        const stops = results.data.stopPlaces.map(stopPlace => ({
            ...stopPlace,
            lines: unique(stopPlace.estimatedCalls.map(({ destinationDisplay, serviceJourney }) => ({
                ...serviceJourney.line,
                name: `${serviceJourney.line.publicCode} ${destinationDisplay.frontText}`,
            })), (a: Line, b: Line) => a.name === b.name),
        }))

        return stops
    } catch (error) {
        return []
    }
}
