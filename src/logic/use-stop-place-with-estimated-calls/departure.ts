import { differenceInMinutes, format, parseISO } from 'date-fns'
import {
    TransportMode,
    TransportSubmode,
} from '../../../graphql-generated/journey-planner-v3'
import { EstimatedCall } from './types'

interface Departure {
    id: string
    expectedDepartureTime: EstimatedCall['expectedDepartureTime']
    transportMode: TransportMode
    transportSubmode: TransportSubmode
    time: string
    departureTime: Date
    route: string
    situations: EstimatedCall['situations']
    cancellation: boolean
    quay: EstimatedCall['quay']
}

function formatTime(minDiff: number, departureTime: Date): string {
    if (minDiff > 15) return format(departureTime, 'HH:mm')
    return minDiff < 1 ? 'Nå' : `${minDiff} min`
}

function toDeparture(estimatedCall: EstimatedCall): Departure {
    const line = estimatedCall.serviceJourney.journeyPattern.line
    const departureTime = parseISO(estimatedCall.expectedDepartureTime)
    const minuteDiff = differenceInMinutes(departureTime, new Date())

    return {
        id: `${estimatedCall.date}::${estimatedCall.aimedDepartureTime}::${estimatedCall.serviceJourney.id}`,
        expectedDepartureTime: estimatedCall.expectedDepartureTime,
        transportMode: line.transportMode,
        transportSubmode: estimatedCall.serviceJourney.transportSubmode,
        time: formatTime(minuteDiff, departureTime),
        departureTime,
        route: `${line.publicCode || ''} ${
            estimatedCall.destinationDisplay.frontText
        }`.trim(),
        situations: estimatedCall.situations,
        cancellation: estimatedCall.cancellation,
        quay: estimatedCall.quay,
    }
}

export { toDeparture }
export type { Departure }
