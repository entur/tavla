import { SelectLines } from 'Admin/scenarios/SelectLines'
import { StopPlaceSettingsQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TStopPlaceTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'

function StopPlaceSettings({ tile }: { tile: TStopPlaceTile }) {
    const { data } = useQuery(StopPlaceSettingsQuery, { id: tile.placeId })

    const lines =
        data?.stopPlace?.quays
            ?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || []

    return <SelectLines tile={tile} lines={lines} />
}

export { StopPlaceSettings }
