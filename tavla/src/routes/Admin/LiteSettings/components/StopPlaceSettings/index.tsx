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
import { useStopPlaceSettingsDataQuery } from 'graphql-generated/journey-planner-v3'
import { uniq, xor } from 'lodash'
import { fieldsNotNull } from 'utils/typeguards'
import { ColumnSetting } from 'lite/components/ColumnSetting'
import { Columns, TColumn, TStopPlaceTile } from 'lite/types/tile'
import { AddColumnSettings } from 'lite/components/AddColumnSettings'
import globals from 'lite/styles/global.module.css'
import { DeleteIcon } from '@entur/icons'
import { Loader } from '@entur/loader'
import { Switch } from '@entur/form'
import { ExpandablePanel } from '@entur/expand'
import classes from './styles.module.css'

function StopPlaceSettings({
    tile,
    setTile,
    removeSelf,
}: {
    tile: TStopPlaceTile
    setTile: (newTile: TStopPlaceTile) => void
    removeSelf: () => void
}) {
    const columns = tile.columns ?? []

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const { data, loading } = useStopPlaceSettingsDataQuery({
        variables: { id: tile.placeId },
        fetchPolicy: 'cache-and-network',
    })

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

    const toggleLine = (line: string) => {
        if (!tile.whitelistedLines)
            return setTile({ ...tile, whitelistedLines: [line] })

        return setTile({
            ...tile,
            whitelistedLines: xor(tile.whitelistedLines, [line]),
        })
    }

    const lines = uniq(
        data?.stopPlace?.quays
            ?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || [],
    ).sort((a, b) =>
        a.publicCode.localeCompare(b.publicCode, 'no-NB', { numeric: true }),
    )

    return (
        <DndContext
            onDragEnd={handleColumnSwap}
            sensors={sensors}
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
        >
            <div className={classes.stopPlaceTile}>
                <div className={classes.tileHeader}>
                    {loading ? (
                        <Loader />
                    ) : (
                        data?.stopPlace?.name ?? tile.placeId
                    )}
                    <button className={globals.button} onClick={removeSelf}>
                        <DeleteIcon size={16} />
                    </button>
                </div>
                <div className={classes.lineToggleContainer}>
                    <ExpandablePanel title="Velg linjer">
                        {lines.map((line) => (
                            <div key={line.id}>
                                <Switch
                                    checked={tile.whitelistedLines?.includes(
                                        line.id,
                                    )}
                                    onChange={() => {
                                        toggleLine(line.id)
                                    }}
                                >
                                    {line.publicCode} {line.name}
                                </Switch>
                            </div>
                        ))}
                    </ExpandablePanel>
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
