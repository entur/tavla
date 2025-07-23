import { TableColumns, TSort, TTableColumn } from 'app/(admin)/utils/types'
import { useSearchParam } from '../../hooks/useSearchParam'
import { Sort } from '../Sort'

function ColumnHeader({ column }: { column: TTableColumn }) {
    const sortParams = useSearchParam('sort')?.split(':')
    const sort = {
        column: sortParams?.[0] as TTableColumn,
        type: sortParams?.[1] as TSort,
    }

    return (
        <div
            key={column}
            className="flex h-10 items-center gap-1 bg-grey70 pl-2"
        >
            <div
                id={TableColumns[column]}
                className="items-center px-0.5 py-0 font-medium"
                aria-sort={
                    sort.column === column && sort.type ? sort.type : 'none'
                }
            >
                {TableColumns[column]}
            </div>
            <Sort column={column} />
        </div>
    )
}

export { ColumnHeader }
