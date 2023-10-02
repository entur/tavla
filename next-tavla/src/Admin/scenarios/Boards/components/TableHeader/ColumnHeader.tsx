import { BoardsColumns, TBoardsColumn } from 'Admin/types/boards'
import classes from './styles.module.css'
import { Sort } from '../Sort'
import { Tooltip } from '@entur/tooltip'
import { useSortableColumnAttributes } from '../../hooks/useSortableColumnAttributes'

function ColumnHeader({ column }: { column: TBoardsColumn }) {
    const { attributes, listeners, setNodeRef, style } =
        useSortableColumnAttributes(column)

    return (
        <div
            ref={setNodeRef}
            style={style}
            key={column}
            className={classes.header}
        >
            <Tooltip placement="top" content="Dra for å flytte">
                <div
                    {...attributes}
                    {...listeners}
                    id={column}
                    className={classes.title}
                >
                    {BoardsColumns[column]}
                </div>
            </Tooltip>
            <Sort column={column} />
        </div>
    )
}

export { ColumnHeader }
