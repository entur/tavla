import { BaseTile } from 'Board/components/BaseTile'
import { useStopPlaceTileData } from 'Board/hooks/useTileData'
import { DEFAULT_COLUMNS } from 'types/column'
import { TStopPlaceTile } from 'types/tile'

export function StopPlaceTile(props: TStopPlaceTile) {
    const tileData = useStopPlaceTileData(props)

    return (
        <BaseTile
            {...tileData}
            columns={props.columns ?? DEFAULT_COLUMNS}
            walkingDistance={props.walkingDistance}
        />
    )
}
