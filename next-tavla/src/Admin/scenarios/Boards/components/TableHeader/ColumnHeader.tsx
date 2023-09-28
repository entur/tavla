import { BoardsColumns, TBoardsColumn } from 'Admin/types/boards'
import classes from './styles.module.css'
import { Sort } from '../Sort'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CSSProperties } from 'react'
import { Tooltip } from '@entur/tooltip'

function ColumnHeader({ column }: { column: TBoardsColumn }) {
    const { attributes, listeners, setNodeRef, transform, transition, active } =
        useSortable({ id: column })

    const otherColumnActive = active && active.id !== column
    const thisColumnActive = active && active.id === column

    const activeStyle =
        thisColumnActive &&
        ({
            backgroundColor: 'var(--main-background-color)',
        } as CSSProperties)

    const style = {
        transform: CSS.Translate.toString(transform),
        transition: transition,
        zIndex: thisColumnActive ? 10 : 0,
        opacity: otherColumnActive ? 0.5 : 1,
        ...activeStyle,
    }

    const titleStyle = {
        backgroundColor: thisColumnActive && 'var(--tertiary-background-color)',
    } as CSSProperties

    return (
        <div
            ref={setNodeRef}
            style={style}
            key={column}
            className={classes.header}
        >
            <Tooltip placement={'top'} content={'Dra for å flytte'}>
                <div
                    {...attributes}
                    {...listeners}
                    id={column}
                    className={classes.title}
                    style={titleStyle}
                >
                    {BoardsColumns[column]}
                </div>
            </Tooltip>
            <Sort column={column} />
        </div>
    )
}

export { ColumnHeader }
