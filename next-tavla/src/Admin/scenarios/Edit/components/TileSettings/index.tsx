import { TTile } from 'types/tile'
import { StopPlaceQuery, StopPlaceSettingsQuery } from 'graphql/index'
import { TStopPlaceTile } from 'types/tile'
import { GetQuayQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TQuayTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'
import { ColumnTileSettings } from './ColumnTileSettings'
import { getWhitelistedAuthorities } from 'utils/authoritiesIDs'

function TileSettings({ tile }: { tile?: TTile; name?: string }) {
    if (tile?.type === 'stop_place') return <StopPlaceSettings tile={tile} />
    if (tile?.type === 'quay') return <QuaySettings tile={tile} />
    return null
}

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
        whitelistedAuthorities: getWhitelistedAuthorities(tile),
        numberOfDepartures: 5,
    }).data?.stopPlace?.estimatedCalls

    return (
        <ColumnTileSettings tile={tile} lines={lines} departures={departures} />
    )
}

function QuaySettings({ tile }: { tile: TQuayTile }) {
    const lines =
        useQuery(GetQuayQuery, {
            quayId: tile.placeId,
        }).data?.quay?.lines.filter(fieldsNotNull) ?? []

    const departures = useQuery(GetQuayQuery, {
        quayId: tile.placeId,
        whitelistedLines: tile.whitelistedLines,
        whitelistedTransportModes: tile.whitelistedTransportModes,
        whitelistedAuthorities: getWhitelistedAuthorities(tile),
        numberOfDepartures: 5,
    }).data?.quay?.estimatedCalls

    return (
        <ColumnTileSettings tile={tile} lines={lines} departures={departures} />
    )
}

export { TileSettings }
