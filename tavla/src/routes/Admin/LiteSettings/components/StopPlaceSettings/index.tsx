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
import { DeleteIcon } from '@entur/icons'
import { ColumnSetting } from '../ColumnSetting'
import { Columns, TColumn, TStopPlaceTile } from '../../types/tile'
import { AddColumnSettings } from '../AddColumnSettings'
import classes from './styles.module.css'

function StopPlaceSettings({
    tile,
    setTile,
    removeSelf,
}: {
    tile: TStopPlaceTile
    setTile: (newTile: TStopPlaceTile) => void
    removeSelf: () => void
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

    const addColumn = (newColumn: TColumn) => {
        setTile({
            ...tile,
            columns: [...(tile.columns || []), newColumn],
        })
    }

    const deleteColumn = (columnToDelete: TColumn) => {
        setTile({
            ...tile,
            columns: columns.filter((column) => column !== columnToDelete),
        })
    }

    return (
        <DndContext
            onDragEnd={handleColumnSwap}
            sensors={sensors}
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
        >
            <div className={classes.stopPlaceTile}>
                <div className={classes.tileHeader}>
                    {tile.placeId}
                    <button className={classes.delete} onClick={removeSelf}>
                        <DeleteIcon />
                    </button>
                </div>
                <div className={classes.columnContainer}>
                    <SortableContext
                        items={columns}
                        strategy={horizontalListSortingStrategy}
                    >
                        {columns.map((column: TColumn) => (
                            <ColumnSetting
                                key={column}
                                column={column}
                                deleteColumn={() => deleteColumn(column)}
                            />
                        ))}
                    </SortableContext>
                    {columns.length < Object.keys(Columns).length && (
                        <AddColumnSettings
                            addColumn={addColumn}
                            selectedColumns={columns}
                        />
                    )}
                </div>
            </div>
        </DndContext>
    )
}

export { StopPlaceSettings }
