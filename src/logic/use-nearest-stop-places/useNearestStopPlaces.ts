import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { isNotNullOrUndefined } from '../../utils/typeguards'
import { Coordinates } from '../../types'
import {
    FilterPlaceType,
    MultiModalMode,
    useNearestStopPlacesQuery,
} from '../../../graphql-generated/journey-planner-v3'
import { NearestStopPlace, toEdge } from './types'

interface UseNearestStopPlaces {
    nearestStopPlaces: NearestStopPlace[]
    loading: boolean
    error: ApolloError | undefined
}

function useNearestStopPlaces(
    position: Coordinates,
    distance = 2000,
): UseNearestStopPlaces {
    const { data, loading, error } = useNearestStopPlacesQuery({
        variables: {
            latitude: position.latitude,
            longitude: position.longitude,
            maximumDistance: distance,
            filterByPlaceTypes: [FilterPlaceType.StopPlace],
            multiModalMode: MultiModalMode.Parent,
        },
        fetchPolicy: 'cache-and-network',
    })

    const nearestStopPlaces = useMemo(
        () =>
            data?.nearest?.edges
                ?.map(toEdge)
                .filter(isNotNullOrUndefined)
                .map((edge) => ({
                    id: edge.node.place.id,
                    distance: edge.node.distance,
                    type: edge.node.place.__typename,
                    latitude: edge.node.place.latitude,
                    longitude: edge.node.place.longitude,
                })) ?? [],
        [data?.nearest],
    )

    return {
        nearestStopPlaces,
        loading,
        error,
    }
}

export { useNearestStopPlaces }
