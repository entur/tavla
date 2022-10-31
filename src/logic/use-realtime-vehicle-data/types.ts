type Line = {
    lineRef: string
    lineName?: string
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

export { Line, RealtimeVehicle }
