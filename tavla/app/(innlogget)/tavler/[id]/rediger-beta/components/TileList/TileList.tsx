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
import { FeedbackText } from '@entur/form'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useEffect, useState } from 'react'
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { saveUpdatedTileOrder } from './actions'
import { DNDAbleStopPlaceTile } from './DNDAbleStopPlaceTile'

export function TileList({ board }: { board: BoardDB }) {
    const [tileArray, setTileArray] = useState<BoardTileDB[]>(board.tiles)
    const [error, setError] = useState<string | undefined>(undefined)
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

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = tileArray.findIndex((t) => t.uuid === active.id)
        const newIndex = tileArray.findIndex((t) => t.uuid === over.id)
        if (oldIndex === -1 || newIndex === -1) return

        const previousArray = tileArray
        const newArray = arrayMove(tileArray, oldIndex, newIndex)
        setTileArray(newArray)

        const result = await saveUpdatedTileOrder(board.id, newArray)
        if (result?.status === 'error') {
            setTileArray(previousArray)
            setError(result.message)
            return
        }

        setError(undefined)
        capture('stop_place_moved', { location: 'edit_board_page' })
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
                    {error && (
                        <FeedbackText variant="negative">{error}</FeedbackText>
                    )}
                </div>
            </SortableContext>
        </DndContext>
    )
}
