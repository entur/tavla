import { TBoardsColumn } from 'Admin/types/boards'
import classes from './styles.module.css'
import { useSortableColumnAttributes } from '../../hooks/useSortableAttributes'

function SortableColumn({
    column,
    children,
}: {
    column: TBoardsColumn
    children: React.ReactNode
}) {
    const { setNodeRef, style, thisColumnActive } =
        useSortableColumnAttributes(column)

    if (thisColumnActive) style.backgroundColor = 'var(--colors-brand-blue)'

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
