import { TEndpointNames } from 'assets/env'
import { TypedDocumentString } from 'graphql/index'
import { fetcher } from 'graphql/utils'
import useSWR from 'swr'

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
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            refreshInterval: mergedOptions.poll ? 30000 : undefined,
            keepPreviousData: true,
        },
    )

    return { data, error, isLoading }
}
