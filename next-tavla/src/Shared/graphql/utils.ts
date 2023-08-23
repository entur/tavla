import { GRAPHQL_ENDPOINTS, TEndpointNames } from 'assets/env'
import useSWR from 'swr'
import { TypedDocumentString } from './index'

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

type TUseQueryOptions = {
    poll: boolean
    endpoint: TEndpointNames
}

export function useQuery<Data, Variables>(
    query: TypedDocumentString<Data, Variables>,
    variables: Variables,
    options?: Partial<TUseQueryOptions>,
) {
    const mergedOptions: TUseQueryOptions = {
        poll: false,
        endpoint: 'journey-planner',
        ...options,
    }

    const { data, error, isLoading } = useSWR<Data>(
        [query, variables, mergedOptions.endpoint],
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            refreshInterval: mergedOptions.poll ? 30000 : undefined,
        },
    )

    return { data, error, isLoading }
}
