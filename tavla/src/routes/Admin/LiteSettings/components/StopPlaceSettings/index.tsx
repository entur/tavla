/* eslint-disable func-style */
import React from 'react'
import {
    DndContext,
    useSensors,
    type DragEndEvent,
    useSensor,
    PointerSensor,
    KeyboardSensor,
} from '@dnd-kit/core'
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import {
    restrictToHorizontalAxis,
    restrictToParentElement,
} from '@dnd-kit/modifiers'
import { ColumnSetting } from '../ColumnSetting'
import { TColumn, TStopPlaceTile } from '../../types/tile'
import classes from './styles.module.css'

function StopPlaceSettings({
    tile,
    setTile,
}: {
    tile: TStopPlaceTile
    setTile: (newTile: TStopPlaceTile) => void
}): JSX.Element {
    const columns = tile.columns ?? []

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleColumnSwap = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = columns.indexOf(active.id as TColumn)
            const newIndex = columns.indexOf(over.id as TColumn)

            setTile({
                ...tile,
                columns: arrayMove(columns, oldIndex, newIndex),
            })
        }
    }

    return (
        <DndContext
            onDragEnd={handleColumnSwap}
            sensors={sensors}
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
        >
            <div className={classes.stopPlaceTile}>
                {tile.placeId}
                <div className={classes.columnContainer}>
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
