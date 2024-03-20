'use server'

import { GRAPHQL_ENDPOINTS, TEndpointNames } from 'assets/env'
import { TypedDocumentString } from 'graphql/index'

async function fetcher<Data, Variables>([query, variables, endpointName]: [
    TypedDocumentString<Data, Variables>,
    Variables,
    TEndpointNames,
]) {
    return fetch(GRAPHQL_ENDPOINTS[endpointName], {
        headers: {
            'Content-Type': 'application/json',
            'ET-Client-Name': 'tavla-test',
        },
        body: JSON.stringify({ query, variables }),
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
}

export async function fetchServerQuery<Data, Variables>(
    query: TypedDocumentString<Data, Variables>,
    variables: Variables,
    options?: Partial<TFetchQueryOptions>,
) {
    const mergedOptions: TFetchQueryOptions = {
        endpoint: 'journey-planner',
        ...options,
    }
    return fetcher([query, variables, mergedOptions.endpoint])
}
