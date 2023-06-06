import { SelectLines } from 'Admin/scenarios/SelectLines'
import { SortableColumns } from 'Admin/scenarios/SortableColumns'
import { GetQuayQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TQuayTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'
import { SortableTileWrapper } from './SortableTileWrapper'
import { TileSettingsWrapper } from './TileSettingsHeader'

function QuaySettings({ tile }: { tile: TQuayTile }) {
    const { data } = useQuery(GetQuayQuery, { quayId: tile.placeId })

    const lines = data?.quay?.lines.filter(fieldsNotNull) ?? []

    const name = !data
        ? data
        : (data.quay?.name ?? tile.placeId) +
          ' - ' +
          (data.quay?.description ?? data.quay?.publicCode)

    return (
        <SortableTileWrapper id={tile.uuid}>
            <TileSettingsWrapper uuid={tile.uuid} name={name}>
                <SelectLines tile={tile} lines={lines} />
                <SortableColumns tile={tile} />
            </TileSettingsWrapper>
        </SortableTileWrapper>
    )
}
export { QuaySettings }
