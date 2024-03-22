import { BoardsColumns, TBoardsColumn, TSort } from 'Admin/types/boards'
import classes from './styles.module.css'
import { Sort } from '../Sort'
import { useSearchParam } from '../../hooks/useSearchParam'

function ColumnHeader({ column }: { column: TBoardsColumn }) {
    const sortParams = useSearchParam('sort')?.split(':')
    const sort = {
        column: sortParams?.[0] as TBoardsColumn,
        type: sortParams?.[1] as TSort,
    }

    return (
        <div key={column} className={classes.header}>
            <div
                id={BoardsColumns[column]}
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
