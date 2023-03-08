import { string, type } from 'superstruct'
import {
    TransportModeEnumStruct,
    TransportSubmodeEnumStruct,
} from 'utils/structs'

const LineDataStruct = type({
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

export { LineDataStruct }
