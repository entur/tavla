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
    arrayMove,
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

function SortableColumns<T extends TStopPlaceTile | TQuayTile>({
    tile,
    setTile,
}: {
    tile: T
    setTile: (newTile: T) => void
}) {
    const columns: TColumnSetting[] = tile.columns ?? []

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

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

    return (
        <div className={classes.columnContainer}>
            <DndContext
                onDragEnd={handleColumnSwap}
                sensors={sensors}
                modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
            >
                <SortableContext
                    items={columns.map(({ type }) => type)}
                    strategy={horizontalListSortingStrategy}
                >
                    {columns.map((column: TColumnSetting) => (
                        <ColumnSettings
                            key={column.type}
                            column={column}
                            deleteColumn={() => deleteColumn(column.type)}
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
    )
}

export { SortableColumns }
