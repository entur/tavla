/*
 Partial interface for Feature from the geocoder endpoint. Only describes the properties we use
 */
interface Feature {
    geometry: {
        coordinates: [number, number]
    }
    properties: {
        id: string
        locality?: string
        name: string
    }
}

interface GeocoderResults {
    features: Feature[]
}

export type { GeocoderResults }
