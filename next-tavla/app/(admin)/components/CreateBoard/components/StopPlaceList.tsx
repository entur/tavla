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
            <Paragraph margin="none" className="mt-6">
                Du har ikke lagt til noen stoppesteder enda.
            </Paragraph>
        )
    return (
        <div className="w-full mt-6">
            {tiles.map((tile) => (
                <TileCard key={tile.uuid} tile={tile} onRemove={onRemove} />
            ))}
        </div>
    )
}

export { StopPlaceList }
