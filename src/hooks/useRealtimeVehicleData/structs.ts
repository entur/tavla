import { boolean, nullable, number, optional, string, type } from 'superstruct'

/**
 * Struct used to validate that what we receive from graphql conforms to the type RealtimeVehicle
 */
const RealtimeVehicleStruct = type({
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

// export type { Line, RealtimeVehicle }
export { RealtimeVehicleStruct }
