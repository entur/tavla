import { BaseTile } from 'Board/components/BaseTile'
import { useCombinedTileData } from 'Board/hooks/useTileData'
import { DEFAULT_COMBINED_COLUMNS } from 'types/column'
import { TTile } from 'types/tile'
import { CombinedTileDeviation } from '../Table/components/StopPlaceDeviation'

export function CombinedTile({
    combinedTile,
    className,
}: {
    combinedTile: TTile[]
    className?: string
}) {
    const tileData = useCombinedTileData(combinedTile)

    return (
        <BaseTile
            {...tileData}
            columns={DEFAULT_COMBINED_COLUMNS}
            customDeviation={
                <CombinedTileDeviation situations={tileData.situations} />
            }
            className={className}
        />
    )
}
