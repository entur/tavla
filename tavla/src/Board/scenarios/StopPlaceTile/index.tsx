import { DEFAULT_COLUMNS } from 'app/(admin)/components/TileSelector/utils'
import { BaseTile } from 'Board/components/BaseTile'
import { useStopPlaceTileData } from 'Board/hooks/useTileData'
import { StopPlaceTileDB } from 'types/db-types/boards'

export function StopPlaceTile(props: StopPlaceTileDB & { className?: string }) {
    const tileData = useStopPlaceTileData(props)

    return (
        <BaseTile
            className={props.className}
            {...tileData}
            columns={props.columns ?? DEFAULT_COLUMNS}
            walkingDistance={props.walkingDistance}
        />
    )
}
