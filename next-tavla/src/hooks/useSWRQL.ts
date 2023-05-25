import useSWR from 'swr'

type endpointNames = 'journey-planner' | 'mobility' | 'vehicles'

// tmp until env is in place
const endpoints: Record<endpointNames, string> = {
    ['journey-planner']:
        'https://api.staging.entur.io/journey-planner/v3/graphql',
    ['mobility']: '',
    ['vehicles']: '',
}

const fetcher = async <Q, V>({
    query,
    variables,
}: {
    query: Q
    variables: V
}) => {
    const res = await fetch(endpoints['journey-planner'], {
        headers: {
            'Content-Type': 'application/json',
            'ET-Client-Name': 'tavla-test',
        },
        body: JSON.stringify({ query, variables }),
        method: 'POST',
    })
    const jsonRes = await res.json()
    return jsonRes.data
}

function useSWRQL<Q, V>(query: string, variables: V) {
    const { data, error, isLoading } = useSWR({ query, variables }, fetcher)

    console.log(data, error, isLoading)
    return {
        data,
        error,
        isLoading,
    } as { data: Q; error: string; isLoading: boolean }
}

export { useSWRQL }
