import { CLIENT_NAME, GRAPHQL_ENDPOINTS, TEndpointNames } from 'assets/env'
import { TypedDocumentString } from './index'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import { formatDateToISO, addMinutesToDate } from 'utils/time'
import { FetchErrorTypes } from 'Board/components/DataFetchingFailed'
import * as Sentry from '@sentry/nextjs'

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
            Sentry.captureException(new Error('Departure fetch timed out'), {
                extra: {
                    url: url,
                    fetchOptions: options,
                },
            })
            throw new Error(FetchErrorTypes.TIMEOUT)
        }
        Sentry.captureException(error, {
            extra: {
                message: 'Unknown error occured during fetch',
                url: url,
                fetchOptions: options,
            },
        })
        throw error
    }
}

export async function fetcher<Data, Variables>([
    query,
    variables,
    endpointName,
    offset,
]: [TypedDocumentString<Data, Variables>, Variables, TEndpointNames, number]) {
    const startTime = formatDateToISO(addMinutesToDate(new Date(), offset))
    const mergedVariables = { ...variables, startTime }

    return fetchWithTimeout(GRAPHQL_ENDPOINTS[endpointName], {
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
