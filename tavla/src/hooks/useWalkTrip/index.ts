import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { useSettings } from 'settings/SettingsProvider'
import { useWalkTripQuery } from 'graphql-generated/journey-planner-v3'
import { Coordinates } from 'src/types'
import { toStruct } from 'utils/utils'
import { WalkTripStruct, WalkTrip } from 'types/structs'

type UseWalkTrip = {
    walkTrip: WalkTrip | null
    loading: boolean
    error: ApolloError | undefined
}

function useWalkTrip(coordinates: Coordinates): UseWalkTrip {
    const [settings] = useSettings()

    const { data, loading, error } = useWalkTripQuery({
        variables: {
            from: {
                coordinates: settings.coordinates,
            },
            to: {
                coordinates,
            },
        },
        skip: settings.hideWalkInfo,
        fetchPolicy: 'cache-first',
    })

    const walkTrip = useMemo(() => {
        const tripPattern = data?.trip.tripPatterns[0]
        return toStruct(WalkTripStruct)(tripPattern)
    }, [data?.trip])

    return {
        walkTrip,
        loading,
        error,
    }
}

export { useWalkTrip }
