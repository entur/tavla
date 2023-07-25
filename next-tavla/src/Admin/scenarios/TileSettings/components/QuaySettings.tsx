import { SelectLines } from 'Admin/scenarios/SelectLines'
import { GetQuayQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TQuayTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'
import { TileSettingsWrapper } from './TileSettingsWrapper'
import { ToggleColumns } from 'Admin/scenarios/ToggleColumns'
import { PlatformDropdown } from './PlatformDropdown'

function QuaySettings({ tile }: { tile: TQuayTile }) {
    const { data } = useQuery(GetQuayQuery, { quayId: tile.placeId })

    const lines = data?.quay?.lines.filter(fieldsNotNull) ?? []
    const name = data?.quay?.name

    return (
        <TileSettingsWrapper title={name} uuid={tile.uuid}>
            <PlatformDropdown
                stopPlaceId={tile.stopPlaceId}
                tile={tile}
                selectedQuayId={tile.placeId}
            />
            <ToggleColumns tile={tile} />
            <SelectLines tile={tile} lines={lines} />
        </TileSettingsWrapper>
    )
}
export { QuaySettings }
