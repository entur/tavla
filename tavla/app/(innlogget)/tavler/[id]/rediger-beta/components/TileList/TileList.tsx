import type { BoardDB } from 'src/types/db-types/boards'
import { StopPlaceTile } from './StopPlaceTile'

export function TileList({ board }: { board: BoardDB }) {
    return (
        <div className="flex flex-col gap-4">
            {board.tiles.map((tile) => (
                <StopPlaceTile key={tile.uuid} tile={tile} />
            ))}
        </div>
    )
}
