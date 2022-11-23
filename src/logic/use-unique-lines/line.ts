import {
    TransportMode,
    TransportSubmode,
} from '../../../graphql-generated/journey-planner-v3'
import { EstimatedCall } from './types'

interface Line {
    id: string
    name: string
    transportMode: TransportMode
    transportSubmode: TransportSubmode
    publicCode: string
    pointsOnLink?: string
}

function toLine(estimatedCall: EstimatedCall): Line {
    return {
        id: estimatedCall.serviceJourney.line.id,
        name: `${estimatedCall.serviceJourney.line.publicCode} ${estimatedCall.destinationDisplay.frontText}`,
        transportMode: estimatedCall.serviceJourney.line.transportMode,
        transportSubmode: estimatedCall.serviceJourney.line.transportSubmode,
        publicCode: estimatedCall.serviceJourney.line.publicCode,
        pointsOnLink: estimatedCall.serviceJourney.pointsOnLink.points,
    }
}

export { toLine }
export type { Line }
