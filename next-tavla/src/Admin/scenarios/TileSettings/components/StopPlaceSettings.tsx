import { SelectLines } from 'Admin/scenarios/SelectLines'
import { StopPlaceSettingsQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TStopPlaceTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'
import { TileSettingsWrapper } from './TileSettingsWrapper'
import { ToggleColumns } from 'Admin/scenarios/ToggleColumns'

function StopPlaceSettings({ tile }: { tile: TStopPlaceTile }) {
    const { data } = useQuery(StopPlaceSettingsQuery, { id: tile.placeId })

    const lines =
        data?.stopPlace?.quays
            ?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || []

    const name = !data ? data : data.stopPlace?.name ?? tile.placeId

    return (
        <TileSettingsWrapper name={name}>
            <ToggleColumns tile={tile} />
            <SelectLines tile={tile} lines={lines} />
        </TileSettingsWrapper>
    )
}

export { StopPlaceSettings }
