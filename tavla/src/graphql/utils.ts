import * as Sentry from '@sentry/nextjs'
import {
    CLIENT_NAME,
    GRAPHQL_ENDPOINTS,
    type TEndpointNames,
} from 'src/assets/env'
import { addMinutesToDate, formatDateToISO } from 'src/utils/time'
import type { TypedDocumentString } from './index'

export enum FetchErrorTypes {
    TIMEOUT = 'Request timed out',
}

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
            throw new Error(FetchErrorTypes.TIMEOUT, { cause: error })
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

    const response = await fetchWithTimeout(GRAPHQL_ENDPOINTS[endpointName], {
        headers: {
            'Content-Type': 'application/json',
            'ET-Client-Name': CLIENT_NAME,
        },
        body: JSON.stringify({ query, variables: mergedVariables }),
        method: 'POST',
    })

    const res = await response.json()

    if (res.errors && res.errors.length > 0) {
        const errorMessage = res.errors[0]?.message || 'Unknown GraphQL error'
        Sentry.captureMessage(`GraphQL error: ${errorMessage}`, {
            level: 'warning',
            extra: {
                errors: res.errors,
                query: query,
                variables: mergedVariables,
                endpoint: endpointName,
            },
        })
        throw new Error(`GraphQL error: ${errorMessage}`)
    }

    if (res.data === null || res.data === undefined) {
        Sentry.captureMessage('GraphQL returned null/undefined data', {
            level: 'warning',
            extra: {
                response: res,
                query: query,
                variables: mergedVariables,
                endpoint: endpointName,
            },
        })
    }

    return res.data as Data
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
    const endpoint = mergedOptions.endpoint
    const start = Date.now()

    try {
        const data = await fetcher([
            query,
            variables,
            endpoint,
            mergedOptions.offset ?? 0,
        ])
        if (typeof window === 'undefined') {
            void import('src/utils/logging').then(({ logHttpRequest }) =>
                logHttpRequest({
                    direction: 'outgoing',
                    method: 'POST',
                    url: GRAPHQL_ENDPOINTS[endpoint],
                    statusCode: 200,
                    latencyMs: Date.now() - start,
                    endpoint,
                    success: true,
                }),
            )
        }
        return data
    } catch (error) {
        if (typeof window === 'undefined') {
            const isTimeout =
                error instanceof Error &&
                error.message === FetchErrorTypes.TIMEOUT
            void import('src/utils/logging').then(({ logHttpRequest }) =>
                logHttpRequest({
                    direction: 'outgoing',
                    method: 'POST',
                    url: GRAPHQL_ENDPOINTS[endpoint],
                    statusCode: isTimeout ? 408 : 500,
                    latencyMs: Date.now() - start,
                    endpoint,
                    success: false,
                }),
            )
        }
        throw error
    }
}
