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
            className="flex items-center gap-1 border-b-2 border-b-[var(--table-header-border-color)] mb-2"
        >
            <div
                id={BoardsColumns[column]}
                className="flex h-[3em] items-center font-medium text-[var(--primary-text-color)] py-0 px-0.5"
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
