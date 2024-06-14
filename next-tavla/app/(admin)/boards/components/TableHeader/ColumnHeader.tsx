import { BoardsColumns, TBoardsColumn, TSort } from 'app/(admin)/utils/types'
import { Sort } from '../Sort'
import { useSearchParam } from '../../hooks/useSearchParam'

function ColumnHeader({ column }: { column: TBoardsColumn }) {
    const sortParams = useSearchParam('sort')?.split(':')
    const sort = {
        column: sortParams?.[0] as TBoardsColumn,
        type: sortParams?.[1] as TSort,
    }

    return (
        <div
            key={column}
            className="flex items-center gap-1 bg-grey70 pl-2 h-10"
        >
            <div
                id={BoardsColumns[column]}
                className="items-center font-medium py-0 px-0.5"
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
