import {
    array,
    boolean,
    define,
    enums,
    Infer,
    is,
    nullable,
    number,
    optional,
    string,
    type,
} from 'superstruct'
import {
    TransportMode,
    TransportSubmode,
} from 'graphql-generated/journey-planner-v3'
import { isValid, parseISO, parse } from 'date-fns'
import { Date as JPDate, DateTime } from './JourneyPlannerV3'

export const WalkTripStruct = type({
    duration: number(),
    walkDistance: number(),
})

export type WalkTrip = Infer<typeof WalkTripStruct>

export const VehicleStruct = type({
    id: string(),
    lat: number(),
    lon: number(),
    system: type({
        operator: type({
            id: string(),
            name: type({
                translation: array(
                    type({
                        language: string(),
                        value: string(),
                    }),
                ),
            }),
        }),
    }),
})

export type Vehicle = Infer<typeof VehicleStruct>

const TransportModeEnumStruct = enums(Object.values(TransportMode))
const TransportSubmodeEnumStruct = enums(Object.values(TransportSubmode))

export const LineDataStruct = type({
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

export type LineData = Infer<typeof LineDataStruct>

// Time structs
function isDateTime(str: unknown): str is DateTime {
    return is(str, string()) && isValid(parseISO(str))
}

export const DateTimeStruct = define<DateTime>('DateTime', isDateTime)

function isDate(str: unknown): str is JPDate {
    return is(str, string()) && isValid(parse(str, 'yyyy-mm-dd', new Date()))
}

export const DateStruct = define<JPDate>('Date', isDate)

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

export const EstimatedCallStruct = type({
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

export type EstimatedCall = Infer<typeof EstimatedCallStruct>

export const StopPlaceWithEstimatedCallsStruct = type({
    id: string(),
    name: string(),
    description: nullable(string()),
    latitude: number(),
    longitude: number(),
    transportMode: array(TransportModeEnumStruct),
    transportSubmode: array(TransportSubmodeEnumStruct),
    estimatedCalls: array(EstimatedCallStruct),
})

export type StopPlaceWithEstimatedCalls = Infer<
    typeof StopPlaceWithEstimatedCallsStruct
>

export const RentalStationStruct = type({
    id: string(),
    name: type({
        translation: array(
            type({
                language: string(),
                value: string(),
            }),
        ),
    }),
    lat: number(),
    lon: number(),
    numBikesAvailable: number(),
    numDocksAvailable: number(),
})

export type RentalStation = Infer<typeof RentalStationStruct>

/**
 * Struct used to validate that what we receive from graphql conforms to the type RealtimeVehicle
 */
export const RealtimeVehicleStruct = type({
    vehicleRef: string(),
    line: type({
        lineRef: string(),
        lineName: optional(nullable(string())),
        publicCode: optional(string()),
        pointsOnLink: optional(string()),
    }),
    mode: string(),
    lastUpdated: string(),
    lastUpdatedEpochSecond: number(),
    location: type({
        latitude: number(),
        longitude: number(),
    }),
    active: optional(boolean()),
})

export type RealtimeVehicle = Infer<typeof RealtimeVehicleStruct>
