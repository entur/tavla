'use client'

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useEffect, useState } from 'react'
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { saveUpdatedTileOrder } from './actions'
import { DNDAbleStopPlaceTile } from './DNDAbleStopPlaceTile'

export function TileList({ board }: { board: BoardDB }) {
    const [tileArray, setTileArray] = useState<BoardTileDB[]>(board.tiles)
    const { capture } = usePosthogTracking()

    useEffect(() => {
        setTileArray(board.tiles)
    }, [board.tiles])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = tileArray.findIndex((t) => t.uuid === active.id)
        const newIndex = tileArray.findIndex((t) => t.uuid === over.id)
        if (oldIndex === -1 || newIndex === -1) return

        const newArray = arrayMove(tileArray, oldIndex, newIndex)
        setTileArray(newArray)
        capture('stop_place_moved', { location: 'edit_board_page' })
        saveUpdatedTileOrder(board.id, newArray)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={tileArray.map((tile) => tile.uuid)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-2">
                    {tileArray.map((tile) => (
                        <DNDAbleStopPlaceTile
                            key={tile.uuid}
                            board={board}
                            tile={tile}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}
