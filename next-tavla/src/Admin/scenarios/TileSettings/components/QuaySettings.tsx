import { SelectLines } from 'Admin/scenarios/SelectLines'
import { GetQuayQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { TQuayTile } from 'types/tile'
import { fieldsNotNull } from 'utils/typeguards'

function QuaySettings({ tile }: { tile: TQuayTile }) {
    const { data } = useQuery(GetQuayQuery, { quayId: tile.placeId })

    const lines = data?.quay?.lines.filter(fieldsNotNull) ?? []

    return <SelectLines tile={tile} lines={lines} />
}
export { QuaySettings }
