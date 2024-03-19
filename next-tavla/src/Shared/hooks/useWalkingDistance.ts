import { WalkDistanceQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'

export function useWalkDistance(
    placeId: string,
    location: { latitude: number; longitude: number },
) {
    return useQuery(WalkDistanceQuery, {
        stopPlaceId: placeId,
        location: {
            latitude: location.latitude,
            longitude: location.longitude,
        },
    })
}
