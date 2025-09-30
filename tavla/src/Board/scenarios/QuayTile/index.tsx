import { BaseTile } from 'Board/components/BaseTile'
import { useQuayTileData } from 'Board/hooks/useTileData'
import { DEFAULT_COLUMNS } from 'types/column'
import { TQuayTile } from 'types/tile'

export function QuayTile(props: TQuayTile) {
    const tileData = useQuayTileData(props)

    return (
        <BaseTile
            {...tileData}
            columns={props.columns ?? DEFAULT_COLUMNS}
            walkingDistance={props.walkingDistance}
        />
    )
}
