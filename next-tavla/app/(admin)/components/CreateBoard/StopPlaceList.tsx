import { Paragraph } from '@entur/typography'
import { TTile } from 'types/tile'
import { TileCard } from './TileCard'

function StopPlaceList({
    tiles,
    onRemove,
}: {
    tiles?: TTile[]
    onRemove: (tile: TTile) => void
}) {
    if (!tiles || tiles.length === 0)
        return (
            <Paragraph>Du har ikke lagt til noen stoppesteder enda.</Paragraph>
        )
    return (
        <div className="g-2 m-2">
            {tiles.map((tile) => (
                <TileCard key={tile.uuid} tile={tile} onRemove={onRemove} />
            ))}
        </div>
    )
}

export { StopPlaceList }
