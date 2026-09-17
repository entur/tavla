import type { BoardDB } from 'src/types/db-types/boards'
import { StopPlaceTile } from './StopPlaceTile'

export function TileList({ board }: { board: BoardDB }) {
    return (
        <div className="flex flex-col gap-2">
            {board.tiles.map((tile) => (
                <StopPlaceTile key={tile.uuid} boardId={board.id} tile={tile} />
            ))}
        </div>
    )
}
