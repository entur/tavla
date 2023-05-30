import useSWR from 'swr'
import { TypedDocumentString } from './index'

type endpointNames = 'journey-planner' | 'mobility' | 'vehicles'

// tmp until env is in place
const endpoints: Record<endpointNames, string> = {
    ['journey-planner']:
        'https://api.staging.entur.io/journey-planner/v3/graphql',
    ['mobility']: '',
    ['vehicles']: '',
}

async function fetcher<Data, Variables>([query, variables]: [
    TypedDocumentString<Data, Variables>,
    Variables,
]) {
    return fetch(endpoints['journey-planner'], {
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

export async function fetchQuery<Data, Variables>(
    query: TypedDocumentString<Data, Variables>,
    variables: Variables,
) {
    return fetcher([query, variables])
}

export function useQuery<Data, Variables>(
    query: TypedDocumentString<Data, Variables>,
    variables: Variables,
    poll = false,
) {
    const { data, error, isLoading } = useSWR<Data>(
        [query, variables],
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            refreshInterval: poll ? 30000 : undefined,
        },
    )

    return { data, error, isLoading }
}
