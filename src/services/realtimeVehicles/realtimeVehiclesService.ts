import {
    ApolloClient,
    InMemoryCache,
    ApolloLink,
    createHttpLink,
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link'

const realtimeVehiclesClient = new ApolloClient({
    link: ApolloLink.from([
        new MultiAPILink({
            endpoints: {
                vehicles:
                    process.env.VEHICLES_REALTIME_HOST ??
                    'https://api.entur.io/realtime/v1/vehicles',
            },
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
        addTypename: false,
    }),
})

export { realtimeVehiclesClient }
