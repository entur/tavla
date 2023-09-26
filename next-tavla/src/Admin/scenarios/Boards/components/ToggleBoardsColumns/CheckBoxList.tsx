import { TBoardsColumn } from 'Admin/types/boards'
import { Dispatch } from 'react'
import { Action } from '../../utils/reducer'

import classes from './styles.module.css'
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { DraggableCheckbox } from './DraggableCheckbox'
import { useBoardsSettingsDispatch } from '../../utils/context'

function CheckboxList({
    columnOrder,
    columns,
}: {
    columnOrder: TBoardsColumn[]
    columns: TBoardsColumn[]
    dispatch: Dispatch<Action>
}) {
    const dispatch = useBoardsSettingsDispatch()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = columnOrder.indexOf(active.id as TBoardsColumn)
            const newIndex = columnOrder.indexOf(over?.id as TBoardsColumn)
            const newOrder = arrayMove(columnOrder, oldIndex, newIndex)
            dispatch({ type: 'setColumnOrder', columnOrder: newOrder })
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={columnOrder}
                strategy={verticalListSortingStrategy}
            >
                {columnOrder.map((column) => (
                    <div key={column} className={classes.checkBoxLine}>
                        <DraggableCheckbox
                            column={column}
                            checked={columns.includes(column as TBoardsColumn)}
                        />
                    </div>
                ))}
            </SortableContext>
        </DndContext>
    )
}
export { CheckboxList }
