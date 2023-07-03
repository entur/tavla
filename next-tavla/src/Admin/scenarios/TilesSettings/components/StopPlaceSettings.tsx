import { SelectLines } from 'Admin/scenarios/SelectLines'
import { SortableColumns } from 'Admin/scenarios/SortableColumns'
import { StopPlaceSettingsQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TStopPlaceTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'
import { TileSettingsWrapper } from './TileSettingsHeader'

function StopPlaceSettings({ tile }: { tile: TStopPlaceTile }) {
    const { data } = useQuery(StopPlaceSettingsQuery, { id: tile.placeId })

    const lines =
        data?.stopPlace?.quays
            ?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || []

    const name = !data ? data : data.stopPlace?.name ?? tile.placeId

    return (
        <TileSettingsWrapper uuid={tile.uuid} name={name}>
            <SelectLines tile={tile} lines={lines} />
            <SortableColumns tile={tile} />
        </TileSettingsWrapper>
    )
}

export { StopPlaceSettings }
