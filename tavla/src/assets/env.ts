export type TEndpointNames = 'journey-planner' | 'mobility' | 'vehicles'

export const GRAPHQL_ENDPOINTS: Record<TEndpointNames, string> = {
    ['journey-planner']: 'https://api.entur.io/journey-planner/v3/graphql',
    ['mobility']: 'https://api.entur.io/mobility/v2/graphql',
    ['vehicles']: 'https://api.entur.io/realtime/v1/vehicles/graphql',
}

export const COUNTY_ENDPOINT = 'https://ws.geonorge.no/kommuneinfo/v1/fylker'
export const GEOCODER_ENDPOINT = 'https://api.entur.io/geocoder/v1'

export const CLIENT_NAME = 'entur-tavla'
