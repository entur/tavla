import { CLIENT_NAME, GRAPHQL_ENDPOINTS, TEndpointNames } from 'assets/env'
import { TypedDocumentString } from './index'
import { formatDateToISO, addMinutesToDate } from 'utils/time'

export async function fetcher<Data, Variables>([
    query,
    variables,
    endpointName,
    offset,
]: [TypedDocumentString<Data, Variables>, Variables, TEndpointNames, number]) {
    const startTime = formatDateToISO(addMinutesToDate(new Date(), offset))
    const mergedVariables = { ...variables, startTime }

    return fetch(GRAPHQL_ENDPOINTS[endpointName], {
        headers: {
            'Content-Type': 'application/json',
            'ET-Client-Name': CLIENT_NAME,
        },
        body: JSON.stringify({ query, variables: mergedVariables }),
        method: 'POST',
    })
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            return res.data as Data
        })
}

type TFetchQueryOptions = {
    endpoint: TEndpointNames
    offset?: number
}

export async function fetchQuery<Data, Variables>(
    query: TypedDocumentString<Data, Variables>,
    variables: Variables,
    options?: Partial<TFetchQueryOptions>,
) {
    const mergedOptions: TFetchQueryOptions = {
        endpoint: 'journey-planner',
        ...options,
    }
    return fetcher([
        query,
        variables,
        mergedOptions.endpoint,
        mergedOptions.offset ?? 0,
    ])
}
