import { Line } from 'src/types'
import { EstimatedCall } from './types'

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
