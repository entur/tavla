import { CLIENT_NAME, GRAPHQL_ENDPOINTS, TEndpointNames } from 'assets/env'
import { TypedDocumentString } from './index'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

async function fetchWithTimeout(
    url: RequestInfo | URL,
    options: RequestInit | undefined,
    timeout = 15000,
) {
    const controller = new AbortController()
    const signal = controller.signal

    const timeoutScheduler = setTimeout(() => controller.abort(), timeout)

    try {
        const response = await fetch(url, { ...options, signal })
        clearTimeout(timeoutScheduler)
        return response
    } catch (error) {
        clearTimeout(timeoutScheduler)
        if (signal.aborted) {
            throw new Error('Request timed out')
        }
        throw error
    }
}

export async function fetcher<Data, Variables>([
    query,
    variables,
    endpointName,
]: [TypedDocumentString<Data, Variables>, Variables, TEndpointNames]) {
    return fetchWithTimeout(GRAPHQL_ENDPOINTS[endpointName], {
        headers: {
            'Content-Type': 'application/json',
            'ET-Client-Name': CLIENT_NAME,
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

export async function fetchQuery<Data, Variables>(
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
