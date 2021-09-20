const REALTIME_GRAPHQL_ENDPOINT =
    process.env.REACT_APP_REALTIME_GRAPHQL_ENDPOINT
const REALTIME_SUBSCRIPTIONS_ENDPOINT =
    process.env.REACT_APP_REALTIME_SUBSCRIPTIONS_ENDPOINT

export const getGraphqlEndpoint = (): string => {
    if (REALTIME_GRAPHQL_ENDPOINT) {
        return REALTIME_GRAPHQL_ENDPOINT
    }
    //Satt mot prod alt sammen da det i skrivende stund er ganske stor forskjell på dataen man får fra de forskjellige miljøene
    switch (window.location.host) {
        case 'tavla.staging.entur.no':
            return 'https://api.entur.io/realtime/v1/vehicles/graphql'
        case 'tavla.entur.no':
            return 'https://api.entur.io/realtime/v1/vehicles/graphql'
        default:
            return 'https://api.entur.io/realtime/v1/vehicles/graphql'
    }
}

export const getSubscriptionsEndpoint = (): string => {
    if (REALTIME_SUBSCRIPTIONS_ENDPOINT) {
        return REALTIME_SUBSCRIPTIONS_ENDPOINT
    }
    //Satt mot prod alt sammen da det i skrivende stund er ganske stor forskjell på dataen man får fra de forskjellige miljøene
    switch (window.location.host) {
        case 'tavla.staging.entur.no':
            return 'wss://api.entur.io/realtime/v1/vehicles/subscriptions'
        case 'tavla.entur.no':
            return 'wss://api.entur.io/realtime/v1/vehicles/subscriptions'
        default:
            return 'wss://api.entur.io/realtime/v1/vehicles/subscriptions'
    }
}
