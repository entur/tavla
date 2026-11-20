import * as Sentry from '@sentry/nextjs'
import {
    CLIENT_NAME,
    GRAPHQL_ENDPOINTS,
    type TEndpointNames,
} from 'src/assets/env'
import { logToGcp } from 'src/utils/logging'
import { addMinutesToDate, formatDateToISO } from 'src/utils/time'
import type { TypedDocumentString } from './index'

async function fetcher<Data, Variables>([
    query,
    variables,
    endpointName,
    offset,
]: [TypedDocumentString<Data, Variables>, Variables, TEndpointNames, number]) {
    const startTime = formatDateToISO(addMinutesToDate(new Date(), offset))
    const mergedVariables = { ...variables, startTime }

    let responseStatus: number | undefined
    try {
        const response = await fetch(GRAPHQL_ENDPOINTS[endpointName], {
            headers: {
                'Content-Type': 'application/json',
                'ET-Client-Name': CLIENT_NAME,
            },
            body: JSON.stringify({ query, variables: mergedVariables }),
            method: 'POST',
        })
        responseStatus = response.status

        const res = await response.json()
        if (res.errors?.length > 0) {
            throw new Error(`GraphQL error: ${res.errors[0]?.message}`)
        }
        if (!response.ok) {
            throw new Error(`HTTP ${responseStatus}`)
        }
        if (res.data === null || res.data === undefined) {
            throw new Error('GraphQL returned no data')
        }

        return res.data as Data
    } catch (error) {
        logToGcp('error', 'graphql request failed', {
            type: 'graphql',
            endpoint: endpointName,
            status: responseStatus,
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
        })
        Sentry.captureException(error, {
            tags: { endpoint: endpointName },
            extra: { variables: mergedVariables },
        })
        throw error
    }
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
