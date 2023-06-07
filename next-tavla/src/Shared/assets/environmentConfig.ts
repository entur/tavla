export type TEndpointNames = 'journey-planner' | 'mobility' | 'vehicles'

const staging_endpoints: Record<TEndpointNames, string> = {
    ['journey-planner']:
        'https://api.staging.entur.io/journey-planner/v3/graphql',
    ['mobility']: '',
    ['vehicles']: '',
}

const prod_endpoints: Record<TEndpointNames, string> = {
    ['journey-planner']: 'https://api.entur.io/journey-planner/v3/graphql',
    ['mobility']: '',
    ['vehicles']: '',
}

const Staging = {
    firebaseConfig: {
        apiKey: 'AIzaSyDXpgZUj0IXBP3ECSlEk6IJwo_6VkYC_VE',
        authDomain: 'entur-tavla-staging.firebaseapp.com',
        databaseURL: 'https://entur-tavla-staging.firebaseio.com',
        projectId: 'entur-tavla-staging',
        storageBucket: 'entur-tavla-staging.appspot.com',
        messagingSenderId: '934908160432',
        appId: '1:934908160432:web:68c802afea624557ca4e75',
    },
    geocoder_endpoint: 'https://api.staging.entur.io/geocoder/v1',
    client_name: 'entur-tavla-staging',
    graphql_endpoints: staging_endpoints,
}

const Prod = {
    firebaseConfig: {
        apiKey: 'AIzaSyDBzat6zxRmQQQQsEpI3YiZ9uX4V9d-Bgg',
        authDomain: 'entur-tavla-prod.firebaseapp.com',
        databaseURL: 'https://entur-tavla-prod.firebaseio.com',
        projectId: 'entur-tavla-prod',
        storageBucket: 'entur-tavla-prod.appspot.com',
        messagingSenderId: '1025677335075',
        appId: '1:1025677335075:web:7e5e1f495564c1a0dcef96',
        measurementId: 'G-GJLJPD7LYB',
    },
    geocoder_endpoint: 'https://api.staging.entur.io/geocoder/v1',
    client_name: 'entur-tavla',
    graphql_endpoints: prod_endpoints,
}

const config = process.env.NEXT_PUBLIC_ENV === 'prod' ? Prod : Staging

export const firebaseConfig = config.firebaseConfig

export const geocoder_endpoint = config.geocoder_endpoint

export const graphql_endpoints = config.graphql_endpoints
