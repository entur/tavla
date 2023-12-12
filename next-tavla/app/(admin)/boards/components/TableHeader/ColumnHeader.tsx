import { BoardsColumns, TBoardsColumn } from 'Admin/types/boards'
import classes from './styles.module.css'
import { Sort } from '../Sort'
import { useBoardsSettings } from '../../hooks/useBoardsSettings'

function ColumnHeader({ column }: { column: TBoardsColumn }) {
    const { sort } = useBoardsSettings()
    return (
        <div key={column} className={classes.header}>
            <div
                id={column}
                className={classes.title}
                aria-sort={
                    sort.column === column && sort.type ? sort.type : 'none'
                }
            >
                {BoardsColumns[column]}
            </div>
            <Sort column={column} />
        </div>
    )
}

export { ColumnHeader }
