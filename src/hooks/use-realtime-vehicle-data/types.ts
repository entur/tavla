import {
    boolean,
    Describe,
    is,
    nullable,
    number,
    optional,
    string,
    type,
} from 'superstruct'

type Line = {
    lineRef: string
    lineName?: string | null
    publicCode?: string
    pointsOnLink?: string
}

type RealtimeVehicle = {
    vehicleRef: string
    line: Line
    mode: string
    lastUpdated: string
    lastUpdatedEpochSecond: number
    location: {
        latitude: number
        longitude: number
    }
    active?: boolean
}

/**
 * Struct used to validate that what we receive from graphql conforms to the type RealtimeVehicle
 */
const RealtimeVehicleStruct: Describe<RealtimeVehicle> = type({
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

function toRealtimeVehicle(vehicleFragment: unknown): RealtimeVehicle | null {
    if (is(vehicleFragment, RealtimeVehicleStruct)) {
        return vehicleFragment
    }
    return null
}

export type { Line, RealtimeVehicle }
export { RealtimeVehicleStruct, toRealtimeVehicle }
