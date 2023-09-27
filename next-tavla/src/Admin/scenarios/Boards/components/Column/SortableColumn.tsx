import { useSortable } from '@dnd-kit/sortable'
import { TBoardsColumn } from 'Admin/types/boards'
import { CSS } from '@dnd-kit/utilities'
import { CSSProperties } from 'react'
import classes from './styles.module.css'

function SortableColumn({
    column,
    children,
    className,
}: {
    column: TBoardsColumn
    children: React.ReactNode
    className?: string
}) {
    const { setNodeRef, transform, transition, active } = useSortable({
        id: column,
    })

    const otherColumnActive = active && active.id !== column
    const thisColumnActive = active && active.id === column

    const activeStyle =
        thisColumnActive &&
        ({
            backgroundColor: 'var(--main-background-color)',
            zIndex: thisColumnActive ? 10 : 0,
        } as CSSProperties)

    const style: CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: otherColumnActive ? 0.5 : 1,
        ...activeStyle,
    }

    if (thisColumnActive) style.backgroundColor = 'var(--colors-brand-blue)'

    return (
        <div
            ref={setNodeRef}
            style={style}
            id={column}
            className={`${className} ${classes.column}`}
        >
            {children}
        </div>
    )
}

export { SortableColumn }
