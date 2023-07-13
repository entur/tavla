import { SelectLines } from 'Admin/scenarios/SelectLines'
import { GetQuayQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TQuayTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'
import { TileSettingsWrapper } from './TileSettingsWrapper'
import { PlatformDropdown } from './PlatformDropdown'

function QuaySettings({ tile }: { tile: TQuayTile }) {
    const { data } = useQuery(GetQuayQuery, { quayId: tile.placeId })

    const lines = data?.quay?.lines.filter(fieldsNotNull) ?? []

    const name = !data
        ? data
        : (data.quay?.name ?? tile.placeId) +
          ' - ' +
          (data.quay?.description ?? data.quay?.publicCode)

    return (
        <TileSettingsWrapper name={name}>
            <PlatformDropdown stopPlaceId={tile.stopPlaceId} uuid={tile.uuid} />
            <SelectLines tile={tile} lines={lines} />
        </TileSettingsWrapper>
    )
}
export { QuaySettings }
