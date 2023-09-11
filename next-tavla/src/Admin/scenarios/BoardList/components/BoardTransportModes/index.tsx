import { useStopPlacesTransportModes } from 'Admin/hooks/useStopPlacesTransportModes'
import { TransportIcon } from 'Board/scenarios/Table/components/TransportIcon'
import { TSettings } from 'types/settings'

function BoardTransportModes({
    board,
}: {
    board: { id: string; settings?: TSettings }
}) {
    const stopPlaceIds =
        board.settings?.tiles?.map((tile) => tile.placeId) ?? []

    const transportModes = useStopPlacesTransportModes(stopPlaceIds)

    return (
        <div>
            {transportModes.sort().map((mode) => (
                <TransportIcon key={mode} transport={mode} />
            ))}
        </div>
    )
}

export { BoardTransportModes }
