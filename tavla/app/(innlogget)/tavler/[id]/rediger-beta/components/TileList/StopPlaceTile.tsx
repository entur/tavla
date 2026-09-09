import { Heading3 } from '@entur/typography'
import type { BoardTileDB } from 'src/types/db-types/boards'

export function StopPlaceTile({ tile }: { tile: BoardTileDB }) {
    return (
        <div className="flex items-center justify-between rounded bg-white px-4 py-3">
            <Heading3 margin="none" className="break-words min-w-0">
                {tile.displayName ?? tile.name}
            </Heading3>
        </div>
    )
}
