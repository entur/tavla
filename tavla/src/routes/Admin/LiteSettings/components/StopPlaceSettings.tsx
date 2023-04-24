/* eslint-disable func-style */
import React, { useState } from 'react'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { xor } from 'lodash'
import { Radio, RadioGroup } from '@entur/form'
import { Button } from '@entur/button'
import { TStopPlaceTile, TColumn, Columns } from '../types/tile'

function LiteTileColumn({ column }: { column: string }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: column })

    const positionStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={{
                color: 'white',
                backgroundColor: '#292b6a',
                flex: 1,
                padding: '1rem',
                borderRadius: '0.5rem',
                ...positionStyle,
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    color: 'black',
                    borderRadius: 5,
                    padding: 3,
                }}
                {...attributes}
                {...listeners}
            >
                DRAG ME
            </div>
            {column}
        </div>
    )
}

function AddColumnSettings({
    selectedColumns,
    addColumn,
}: {
    selectedColumns: TColumn[]
    addColumn: (column: TColumn) => void
}) {
    const [column, setColumn] = useState<TColumn | null>(null)

    return (
        <div
            style={{
                backgroundColor: 'var(--tavla-box-background-color)',
                padding: '1rem',
            }}
        >
            <RadioGroup
                name="new-column-settings"
                label="Velg kolonne"
                onChange={(e) => {
                    setColumn(e.target.value as TColumn)
                }}
                value={column}
            >
                {xor(selectedColumns, Object.keys(Columns) as TColumn[]).map(
                    (key) => (
                        <Radio key={key} value={key}>
                            {Columns[key]}
                        </Radio>
                    ),
                )}
            </RadioGroup>
            <Button
                variant="primary"
                disabled={!column}
                onClick={() => {
                    if (column) addColumn(column)
                    setColumn(null)
                }}
            >
                Legg til kolonne
            </Button>
        </div>
    )
}

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

    const addColumn = (newColumn: TColumn) => {
        setTile({
            ...tile,
            columns: [...(tile.columns || []), newColumn],
        })
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
                <div
                    style={{
                        display: 'flex',
                        height: '500px',
                        gap: '10px',
                        color: 'white',
                    }}
                >
                    <SortableContext
                        items={columns}
                        strategy={horizontalListSortingStrategy}
                    >
                        {columns.map((column: string) => (
                            <LiteTileColumn key={column} column={column} />
                        ))}
                    </SortableContext>
                    <AddColumnSettings
                        addColumn={addColumn}
                        selectedColumns={columns}
                    />
                </div>
            </div>
        </DndContext>
    )
}

export { StopPlaceSettings }
