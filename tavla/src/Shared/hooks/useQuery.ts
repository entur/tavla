import { TEndpointNames } from 'assets/env'
import { TypedDocumentString } from 'graphql/index'
import { fetcher } from 'graphql/utils'
import useSWR from 'swr'

type TUseQueryOptions<Data> = {
    poll: boolean
    endpoint: TEndpointNames
    fallbackData?: Data
    offset?: number
}

export function useQuery<Data, Variables>(
    query: TypedDocumentString<Data, Variables>,
    variables: Variables,
    options?: Partial<TUseQueryOptions<Data>>,
) {
    const mergedOptions: TUseQueryOptions<Data> = {
        poll: false,
        endpoint: 'journey-planner',
        ...options,
    }

    const { data, error, isLoading } = useSWR<Data>(
        [query, variables, mergedOptions.endpoint, mergedOptions.offset ?? 0],
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            refreshInterval: mergedOptions.poll ? 30000 : undefined,
            keepPreviousData: true,
            fallbackData: mergedOptions.fallbackData,
        },
    )

    return { data, error, isLoading }
}
