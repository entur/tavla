import { GetQuayQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TQuayTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'
import { ColumnTileSettings } from './ColumnTileSettings'

function QuaySettings({ tile }: { tile: TQuayTile }) {
    const lines =
        useQuery(GetQuayQuery, {
            quayId: tile.placeId,
        }).data?.quay?.lines.filter(fieldsNotNull) ?? []

    const departures = useQuery(GetQuayQuery, {
        quayId: tile.placeId,
        whitelistedLines: tile.whitelistedLines,
        whitelistedTransportModes: tile.whitelistedTransportModes,
        numberOfDepartures: 5,
    }).data?.quay?.estimatedCalls

    return (
        <ColumnTileSettings tile={tile} lines={lines} departures={departures} />
    )
}
export { QuaySettings }
