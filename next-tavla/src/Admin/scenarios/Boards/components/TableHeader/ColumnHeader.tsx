import { BoardsColumns, TBoardsColumn } from 'Admin/types/boards'
import classes from './styles.module.css'
import { Sort } from '../Sort'

function ColumnHeader({ column }: { column: TBoardsColumn }) {
    return (
        <>
            <div key={column} className={classes.header}>
                <div className={classes.title}>{BoardsColumns[column]}</div>
                <Sort column={column} />
            </div>
        </>
    )
}

export { ColumnHeader }
