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
import { ColumnSetting } from 'components/ColumnSetting'
import { Columns, TColumn, TStopPlaceTile, TColumnSetting } from 'types/tile'
import { AddColumnSettings } from 'components/AddColumnSettings'
import globals from 'styles/global.module.css'
import { DeleteIcon } from '@entur/icons'
import { Loader } from '@entur/loader'
import { Switch } from '@entur/form'
import { ExpandablePanel } from '@entur/expand'
import { SortableTileWrapper } from '../SortableTileWrapper'
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
            const oldIndex = columns.findIndex((col) => col.type === active.id)
            const newIndex = columns.findIndex((col) => col.type === over.id)

            setTile({
                ...tile,
                columns: arrayMove(columns, oldIndex, newIndex),
            })
        }
    }

    const addColumn = (newColumn: TColumn) => {
        setTile({
            ...tile,
            columns: [...(tile.columns || []), { type: newColumn }],
        })
    }

    const deleteColumn = (columnToDelete: TColumn) => {
        setTile({
            ...tile,
            columns: columns.filter((column) => column.type !== columnToDelete),
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
        <SortableTileWrapper id={tile.uuid}>
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
                    <DndContext
                        onDragEnd={handleColumnSwap}
                        sensors={sensors}
                        modifiers={[
                            restrictToHorizontalAxis,
                            restrictToParentElement,
                        ]}
                    >
                        <SortableContext
                            items={columns.map(({ type }) => type)}
                            strategy={horizontalListSortingStrategy}
                        >
                            {columns.map((column: TColumnSetting) => (
                                <ColumnSetting
                                    key={column.type}
                                    column={column}
                                    deleteColumn={() =>
                                        deleteColumn(column.type)
                                    }
                                />
                            ))}
                        </SortableContext>
                        {columns.length < Object.keys(Columns).length && (
                            <AddColumnSettings
                                addColumn={addColumn}
                                selectedColumns={columns.map(
                                    ({ type }) => type,
                                )}
                            />
                        )}
                    </DndContext>
                </div>
            </div>
        </SortableTileWrapper>
    )
}

export { StopPlaceSettings }
