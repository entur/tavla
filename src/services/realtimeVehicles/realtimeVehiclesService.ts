import {
    ApolloClient,
    InMemoryCache,
    ApolloLink,
    createHttpLink,
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link'

const CLIENT_NAME = process.env.CLIENT_NAME || ''

if (!CLIENT_NAME && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(
        'CLIENT_NAME is missing! Please set a client name in your environment config.',
    )
}

const endpoints = {
    vehicles:
        process.env.VEHICLES_REALTIME_HOST ??
        'https://api.entur.io/realtime/v1/vehicles',
    mobility: process.env.MOBILITY_HOST ?? 'https://api.entur.io/mobility/v2',
    journey_planner_v2:
        process.env.JOURNEYPLANNER_HOST_V2 ??
        'https://api.entur.io/journey-planner/v2',
    journey_planner_v3:
        process.env.JOURNEYPLANNER_HOST_V3 ??
        'https://api.entur.io/journey-planner/v3',
}

const apolloClient = new ApolloClient({
    headers: {
        'ET-Client-Name': CLIENT_NAME,
    },
    link: ApolloLink.from([
        new MultiAPILink({
            endpoints,
            httpSuffix: '/graphql',
            wsSuffix: '/subscriptions',
            createHttpLink: () => createHttpLink(),
            createWsLink: (endpoint) =>
                new WebSocketLink({
                    uri: endpoint,
                    options: {
                        reconnect: true,
                    },
                }),
        }),
    ]),
    cache: new InMemoryCache({
        addTypename: true,
    }),
})

export { apolloClient }
