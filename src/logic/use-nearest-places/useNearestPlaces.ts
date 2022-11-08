import { useMemo } from 'react'
import { isNotNullOrUndefined } from '../../utils/typeguards'
import { Coordinates } from '../../types'
import {
    FilterPlaceType,
    MultiModalMode,
    useNearestPlacesQuery,
} from '../../../graphql-generated/journey-planner-v3'
import { NearestPlace, toEdge } from './types'

function useNearestPlaces(
    position: Coordinates,
    distance = 2000,
): NearestPlace[] {
    const { data } = useNearestPlacesQuery({
        variables: {
            latitude: position.latitude,
            longitude: position.longitude,
            maximumDistance: distance,
            filterByPlaceTypes: [FilterPlaceType.StopPlace],
            multiModalMode: MultiModalMode.Parent,
        },
    })

    return useMemo(
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
}

export { useNearestPlaces }
