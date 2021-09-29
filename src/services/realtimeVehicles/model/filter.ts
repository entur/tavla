export type Filter = {
    codespaceId?: string
    serviceJourneyId?: string
    mode?: string
    operatorRef?: string
    vehicleRef?: string
    lineRef?: string
    lineName?: string
    boundingBox?: {
        minLat: number
        minLon: number
        maxLat: number
        maxLon: number
    }
    monitored?: boolean
}
