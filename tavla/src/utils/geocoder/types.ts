/*
 Partial type for Feature from the geocoder endpoint. Only describes the properties we use
 */
type Feature = {
    geometry: {
        coordinates: [number, number]
    }
    properties: {
        id: string
        locality?: string
        name: string
    }
}

type GeocoderResults = {
    features: Feature[]
}

export type { GeocoderResults }
