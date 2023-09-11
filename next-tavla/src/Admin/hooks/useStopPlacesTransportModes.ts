import { StopPlacesTransportModesQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { uniqueArrayItems } from 'utils/uniqueArrayItems'

function useStopPlacesTransportModes(stopPlaceIds: string[]) {
    const transportModes =
        useQuery(StopPlacesTransportModesQuery, {
            stopPlaceIds,
        })
            .data?.stopPlaces.flat()
            .map((stopPlace) => stopPlace?.transportMode)
            .flat()
            .filter(isNotNullOrUndefined) ?? []

    return uniqueArrayItems(transportModes)
}

export { useStopPlacesTransportModes }
