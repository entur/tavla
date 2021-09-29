import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = new HttpLink({
    uri:
        process.env.VEHICLES_REALTIME_HOST ??
        'https://api.entur.io/realtime/v1/vehicles/graphql',
})

const wsLink = new WebSocketLink({
    uri:
        process.env.VEHCILES_REALTIME_SUBSCRIPTIONS_HOST ??
        'wss://api.entur.io/realtime/v1/vehicles/subscriptions',
    options: {
        reconnect: true,
    },
})

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    httpLink,
)

export const realtimeVehiclesClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
        addTypename: false,
    }),
})
