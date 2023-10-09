export type TEndpointNames = 'journey-planner' | 'mobility' | 'vehicles'

export const GRAPHQL_ENDPOINTS: Record<TEndpointNames, string> = {
    ['journey-planner']: 'https://api.entur.io/journey-planner/v3/graphql',
    ['mobility']: 'https://api.entur.io/mobility/v2/graphql',
    ['vehicles']: 'https://api.entur.io/realtime/v1/vehicles/graphql',
}

export const COUNTY_ENDPOINT = 'https://ws.geonorge.no/kommuneinfo/v1/fylker'
export const GEOCODER_ENDPOINT = 'https://api.entur.io/geocoder/v1'

export const CLIENT_NAME = 'entur-tavla-staging'

const FIREBASE_DEV_CONFIG = {
    apiKey: 'AIzaSyCjyL7k4AehY4M95cxBVaW4LJTy6JNdTjo',
    authDomain: 'ent-tavla-dev.firebaseapp.com',
    projectId: 'ent-tavla-dev',
    storageBucket: 'ent-tavla-dev.appspot.com',
    messagingSenderId: '992979087014',
    appId: '1:992979087014:web:3af389943fe02c0cf34e67',
}

const FIREBASE_PRD_CONFIG = {
    apiKey: 'AIzaSyCYIqxsPo2mJ8dupGENDWAECO6JYXm4iRk',
    authDomain: 'ent-tavla-prd.firebaseapp.com',
    projectId: 'ent-tavla-prd',
    storageBucket: 'ent-tavla-prd.appspot.com',
    messagingSenderId: '206753066197',
    appId: '1:206753066197:web:c136b4473eeff99e24c65c',
}

export const FIREBASE_CLIENT_CONFIG =
    process.env.NEXT_PUBLIC_ENV === 'prod'
        ? FIREBASE_PRD_CONFIG
        : FIREBASE_DEV_CONFIG
