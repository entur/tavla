import { StopPlacesTransportModesQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { isNotNullOrUndefined } from 'utils/typeguards'

function useStopPlacesTransportModes(stopPlaceIds: string[]) {
    return (
        Array.from(
            new Set(
                useQuery(StopPlacesTransportModesQuery, {
                    stopPlaceIds,
                })
                    .data?.stopPlaces.flat()
                    .map((stopPlace) => stopPlace?.transportMode)
                    .flat()
                    .filter(isNotNullOrUndefined),
            ),
        ) ?? []
    )
}

export { useStopPlacesTransportModes }
