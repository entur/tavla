import { Infer, is, string, type } from 'superstruct'
import {
    TransportModeEnumStruct,
    TransportSubmodeEnumStruct,
} from '../../utils/structs'

const EstimatedCallStruct = type({
    destinationDisplay: type({
        frontText: string(),
    }),
    serviceJourney: type({
        line: type({
            id: string(),
            transportMode: TransportModeEnumStruct,
            transportSubmode: TransportSubmodeEnumStruct,
            publicCode: string(),
        }),
        pointsOnLink: type({
            points: string(),
        }),
    }),
})

type EstimatedCall = Infer<typeof EstimatedCallStruct>

const toEstimatedCall = (obj: unknown) => {
    if (is(obj, EstimatedCallStruct)) {
        return obj
    }
    return null
}

export { toEstimatedCall }
export type { EstimatedCall }
