import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    restrictToHorizontalAxis,
    restrictToParentElement,
} from '@dnd-kit/modifiers'
import {
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import {
    Columns,
    TColumn,
    TColumnSetting,
    TQuayTile,
    TStopPlaceTile,
} from 'types/tile'
import { AddColumn } from '../AddColumn'
import { ColumnSettings } from '../ColumnSettings'
import classes from './styles.module.css'
import { ExpandablePanel } from '@entur/expand'
import { useSettingsDispatch } from 'Admin/utils/contexts'

function SortableColumns<T extends TStopPlaceTile | TQuayTile>({
    tile,
    defaultOpen = false,
}: {
    tile: T
    defaultOpen?: boolean
}) {
    const columns: TColumnSetting[] = tile.columns ?? []

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const dispatch = useSettingsDispatch()

    const handleColumnSwap = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = columns.findIndex((col) => col.type === active.id)
            const newIndex = columns.findIndex((col) => col.type === over.id)

            dispatch({
                type: 'swapColumns',
                tileId: tile.uuid,
                oldIndex,
                newIndex,
            })
        }
    }

    const addColumn = (newColumn: TColumn) => {
        dispatch({ type: 'addColumn', tileId: tile.uuid, column: newColumn })
    }

    const removeColumn = (columnToDelete: TColumn) => {
        dispatch({
            type: 'removeColumn',
            tileId: tile.uuid,
            column: columnToDelete,
        })
    }

    const updateColumn = (newColumn: TColumnSetting) => {
        dispatch({
            type: 'updateColumn',
            tileId: tile.uuid,
            columnSetting: newColumn,
        })
    }

    return (
        <ExpandablePanel title="Velg kolonner" defaultOpen={defaultOpen}>
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
                            <ColumnSettings
                                key={column.type}
                                column={column}
                                updateColumn={updateColumn}
                                removeColumn={removeColumn}
                            />
                        ))}
                    </SortableContext>
                    {columns.length < Object.keys(Columns).length && (
                        <AddColumn
                            addColumn={addColumn}
                            selectedColumns={columns.map(({ type }) => type)}
                        />
                    )}
                </DndContext>
            </div>
        </ExpandablePanel>
    )
}

export { SortableColumns }
