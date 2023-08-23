export type TEndpointNames = 'journey-planner' | 'mobility' | 'vehicles'

export const GRAPHQL_ENDPOINTS: Record<TEndpointNames, string> = {
    ['journey-planner']: 'https://api.entur.io/journey-planner/v3/graphql',
    ['mobility']: 'https://api.entur.io/mobility/v2/graphql',
    ['vehicles']: 'https://api.entur.io/realtime/v1/vehicles/graphql',
}

export const GEOCODER_ENDPOINT = 'https://api.entur.io/geocoder/v1'

export const CLIENT_NAME = 'entur-tavla-staging'

export const FIREBASE_CLIENT_CONFIG = {
    apiKey: 'AIzaSyDXpgZUj0IXBP3ECSlEk6IJwo_6VkYC_VE',
    authDomain: 'entur-tavla-staging.firebaseapp.com',
    databaseURL: 'https://entur-tavla-staging.firebaseio.com',
    projectId: 'entur-tavla-staging',
    storageBucket: 'entur-tavla-staging.appspot.com',
    messagingSenderId: '934908160432',
    appId: '1:934908160432:web:68c802afea624557ca4e75',
}
