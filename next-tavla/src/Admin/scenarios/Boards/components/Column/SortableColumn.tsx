import { TBoardsColumn } from 'Admin/types/boards'
import classes from './styles.module.css'
import { useSortableColumnAttributes } from '../../hooks/useSortableColumnAttributes'

function SortableColumn({
    column,
    children,
}: {
    column: TBoardsColumn
    children: React.ReactNode
}) {
    const { setNodeRef, style } = useSortableColumnAttributes(column)

    return (
        <div
            ref={setNodeRef}
            style={style}
            id={column}
            className={classes.column}
        >
            {children}
        </div>
    )
}

export { SortableColumn }
