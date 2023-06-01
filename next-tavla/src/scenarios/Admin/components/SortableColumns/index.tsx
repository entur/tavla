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
import { useSettingsDispatch } from 'scenarios/Admin/reducer'
import { ExpandablePanel } from '@entur/expand'

function SortableColumns<T extends TStopPlaceTile | TQuayTile>({
    tile,
}: {
    tile: T
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

    return (
        <ExpandablePanel title="Velg kolonner">
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
                                deleteColumn={() => removeColumn(column.type)}
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
