import classes from './styles.module.css'
import { BoardsColumns, TBoardsColumn } from 'Admin/types/boards'
import { Sort } from '../Sort'

function TableHeader({ columns }: { columns: TBoardsColumn[] }) {
    return (
        <>
            {columns.map((column) => (
                <div key={column} className={classes.header}>
                    <div className={classes.title}>{BoardsColumns[column]}</div>
                    <Sort column={column} />
                </div>
            ))}
        </>
    )
}

export { TableHeader }
