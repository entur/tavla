'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { StopPlaceTile } from './StopPlaceTile'

export function DNDAbleStopPlaceTile({
    board,
    tile,
}: {
    board: BoardDB
    tile: BoardTileDB
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tile.uuid })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <StopPlaceTile
                board={board}
                tile={tile}
                dragHandleAttributes={attributes}
                dragHandleListeners={listeners}
            />
        </div>
    )
}
