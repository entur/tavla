import { Checkbox } from '@entur/form'
import { TBoardsColumn, BoardsColumns } from 'Admin/types/boards'
import { useBoardsSettingsDispatch } from '../../utils/context'
import { SortableHandle } from 'Admin/components/SortableHandle'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import classes from './styles.module.css'

function DraggableCheckbox({
    column,
    checked,
}: {
    column: TBoardsColumn
    checked: boolean
}) {
    const dispatch = useBoardsSettingsDispatch()

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: column })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            className={classes.draggableCheckbox}
            ref={setNodeRef}
            style={style}
        >
            <SortableHandle {...attributes} {...listeners} id={column} />
            <Checkbox
                key={column}
                checked={checked}
                onChange={() =>
                    dispatch({
                        type: 'toggleColumn',
                        column: column,
                    })
                }
            >
                {BoardsColumns[column]}
            </Checkbox>
        </div>
    )
}

export { DraggableCheckbox }
