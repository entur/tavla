/* eslint-disable func-style */
import React from 'react'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable'
import { ColumnSetting } from '../ColumnSetting'
import { TColumn, TStopPlaceTile } from '../../types/tile'

function StopPlaceSettings({
    tile,
    setTile,
}: {
    tile: TStopPlaceTile
    setTile: (newTile: TStopPlaceTile) => void
}): JSX.Element {
    const columns = tile.columns ?? []

    const handleColumnSwap = (event: DragEndEvent) => {
        const { active, over } = event

        if (active && over && active.id !== over.id) {
            const oldIndex = columns.indexOf(active.id as TColumn)
            const newIndex = columns.indexOf(over.id as TColumn)

            setTile({
                ...tile,
                columns: arrayMove(columns, oldIndex, newIndex),
            })
        }
    }

    return (
        <DndContext onDragEnd={handleColumnSwap}>
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: 'black',
                }}
            >
                {tile.placeId}
                <div style={{ display: 'flex', height: '500px', gap: '10px' }}>
                    <SortableContext
                        items={columns}
                        strategy={horizontalListSortingStrategy}
                    >
                        {columns.map((column: string) => (
                            <ColumnSetting key={column} column={column} />
                        ))}
                    </SortableContext>
                </div>
            </div>
        </DndContext>
    )
}

export { StopPlaceSettings }
