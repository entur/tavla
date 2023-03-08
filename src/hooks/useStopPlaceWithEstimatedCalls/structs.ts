import { array, boolean, number, string, type, nullable } from 'superstruct'
import {
    DateStruct,
    DateTimeStruct,
    TransportModeEnumStruct,
    TransportSubmodeEnumStruct,
} from 'utils/structs'

const SituationStruct = type({
    description: array(
        type({
            value: string(),
        }),
    ),
    summary: array(
        type({
            value: string(),
        }),
    ),
})

const EstimatedCallStruct = type({
    aimedDepartureTime: DateTimeStruct,
    cancellation: boolean(),
    date: DateStruct,
    destinationDisplay: type({
        frontText: string(),
    }),
    expectedDepartureTime: DateTimeStruct,
    quay: type({
        id: string(),
        name: string(),
        publicCode: nullable(string()),
    }),
    serviceJourney: type({
        id: string(),
        journeyPattern: type({
            line: type({
                publicCode: nullable(string()),
                transportMode: TransportModeEnumStruct,
            }),
        }),
        transportSubmode: TransportSubmodeEnumStruct,
    }),
    situations: array(SituationStruct),
})

const StopPlaceWithEstimatedCallsStruct = type({
    id: string(),
    name: string(),
    description: nullable(string()),
    latitude: number(),
    longitude: number(),
    transportMode: array(TransportModeEnumStruct),
    transportSubmode: array(TransportSubmodeEnumStruct),
    estimatedCalls: array(EstimatedCallStruct),
})

export { EstimatedCallStruct, StopPlaceWithEstimatedCallsStruct }
