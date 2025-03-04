import {
    BoardsAndFoldersColumns,
    TTableColumn,
    TSort,
} from 'app/(admin)/utils/types'
import { Sort } from '../Sort'
import { useSearchParam } from '../../hooks/useSearchParam'

function ColumnHeader({ column }: { column: TTableColumn }) {
    const sortParams = useSearchParam('sort')?.split(':')
    const sort = {
        column: sortParams?.[0] as TTableColumn,
        type: sortParams?.[1] as TSort,
    }

    return (
        <div
            key={column}
            className="flex items-center gap-1 bg-grey70 pl-2 h-10"
        >
            <div
                id={BoardsAndFoldersColumns[column]}
                className="items-center font-medium py-0 px-0.5"
                aria-sort={
                    sort.column === column && sort.type ? sort.type : 'none'
                }
            >
                {BoardsAndFoldersColumns[column]}
            </div>
            <Sort column={column} />
        </div>
    )
}

export { ColumnHeader }
