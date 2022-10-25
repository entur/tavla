import {
    ApolloClient,
    InMemoryCache,
    ApolloLink,
    createHttpLink,
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link'
import { CLIENT_NAME } from '../../constants'

const endpoints = {
    vehicles:
        process.env.VEHICLES_REALTIME_HOST ??
        'https://api.entur.io/realtime/v1/vehicles',
    mobility: process.env.MOBILITY_HOST ?? 'https://api.entur.io/mobility/v2',
    journey_planner_v3:
        process.env.JOURNEYPLANNER_HOST_V3 ??
        'https://api.entur.io/journey-planner/v3',
}

const apolloClient = new ApolloClient({
    link: ApolloLink.from([
        new MultiAPILink({
            endpoints,
            httpSuffix: '/graphql',
            wsSuffix: '/subscriptions',
            createHttpLink: () =>
                createHttpLink({
                    headers: {
                        'ET-Client-Name': CLIENT_NAME,
                    },
                }),
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
