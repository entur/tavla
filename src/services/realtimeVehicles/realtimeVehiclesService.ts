import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
} from '@apollo/client'

const CLIENT_NAME = process.env.CLIENT_NAME || ''

if (!CLIENT_NAME && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(
        'CLIENT_NAME is missing! Please set a client name in your environment config.',
    )
}

const mobilityLink = new HttpLink({
    uri:
        (process.env.MOBILITY_HOST ?? 'https://api.entur.io/mobility/v2') +
        '/graphql',
    headers: {
        'ET-Client-Name': CLIENT_NAME,
    },
})

const vehiclesLink = new HttpLink({
    uri:
        process.env.VEHICLES_REALTIME_HOST ??
        'https://api.staging.entur.io/realtime/v1/vehicles/graphql',
    headers: {
        'ET-Client-Name': CLIENT_NAME,
    },
})
export const realtimeVehiclesClient = new ApolloClient({
    link: ApolloLink.split(
        (operation) => operation.getContext().endPoint === 'mobility',
        mobilityLink,
        vehiclesLink,
    ),

    cache: new InMemoryCache({
        addTypename: false,
    }),
})
