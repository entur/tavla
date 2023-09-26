import { BoardsColumns, TBoardsColumn } from 'Admin/types/boards'
import classes from './styles.module.css'
import { Sort } from '../Sort'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableHandle } from 'Admin/components/SortableHandle'
import { DraggableIcon } from '@entur/icons'

function ColumnHeader({ column }: { column: TBoardsColumn }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: column })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                key={column}
                className={classes.header}
            >
                <SortableHandle
                    {...attributes}
                    {...listeners}
                    icon={<DraggableIcon size={16} />}
                    id={column}
                    ariaLabel={`Sorteringsknapp for kolonner: ${BoardsColumns[column]}`}
                />
                <div className={classes.title}>{BoardsColumns[column]}</div>
                <Sort column={column} />
            </div>
        </>
    )
}

export { ColumnHeader }
