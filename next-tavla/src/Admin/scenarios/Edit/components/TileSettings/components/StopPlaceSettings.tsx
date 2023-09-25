import { StopPlaceQuery, StopPlaceSettingsQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TStopPlaceTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'
import { ColumnTileSettings } from './ColumnTileSettings'

function StopPlaceSettings({ tile }: { tile: TStopPlaceTile }) {
    const lines =
        useQuery(StopPlaceSettingsQuery, {
            id: tile.placeId,
        })
            .data?.stopPlace?.quays?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || []

    const departures = useQuery(StopPlaceQuery, {
        stopPlaceId: tile.placeId,
        whitelistedLines: tile.whitelistedLines,
        whitelistedTransportModes: tile.whitelistedTransportModes,
        numberOfDepartures: 5,
    }).data?.stopPlace?.estimatedCalls

    return (
        <ColumnTileSettings tile={tile} lines={lines} departures={departures} />
    )
}

export { StopPlaceSettings }
