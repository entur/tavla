import { TransportIcon } from 'Board/scenarios/Table/components/TransportIcon'
import { StopPlacesTransportModesQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TBoard } from 'types/settings'
import { isNotNullOrUndefined } from 'utils/typeguards'

function BoardTransportModes({ board }: { board: TBoard }) {
    const stopPlaceIds = board.tiles?.map((tile) => tile.placeId) ?? []

    const transportModes =
        useQuery(StopPlacesTransportModesQuery, {
            stopPlaceIds,
        })
            .data?.stopPlaces.flat()
            .map((stopPlace) => stopPlace?.transportMode)
            .flat()
            .filter(isNotNullOrUndefined)
            .filter((item, index, array) => array.indexOf(item) === index) ?? []

    return (
        <div>
            {transportModes.sort().map((mode) => (
                <TransportIcon key={mode} transport={mode} />
            ))}
        </div>
    )
}

export { BoardTransportModes }
