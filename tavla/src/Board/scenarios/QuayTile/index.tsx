import { DEFAULT_COLUMNS } from 'app/(admin)/components/TileSelector/utils'
import { BaseTile } from 'Board/components/BaseTile'
import { useQuayTileData } from 'Board/hooks/useTileData'
import { QuayTileDB } from 'types/db-types/boards'

export function QuayTile(props: QuayTileDB & { className?: string }) {
    const tileData = useQuayTileData(props)

    return (
        <BaseTile
            {...tileData}
            columns={props.columns ?? DEFAULT_COLUMNS}
            walkingDistance={props.walkingDistance}
            className={props.className}
        />
    )
}
