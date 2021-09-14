import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

import { getGraphqlEndpoint, getSubscriptionsEndpoint } from './apolloConfig'

const httpLink = new HttpLink({
    uri: getGraphqlEndpoint(),
})

const wsLink = new WebSocketLink({
    uri: getSubscriptionsEndpoint(),
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

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
        addTypename: false,
    }),
})
