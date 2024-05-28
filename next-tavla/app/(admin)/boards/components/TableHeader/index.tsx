import { BoardsColumns, TBoardsColumn, TSort } from 'app/(admin)/utils/types'
import { HeaderCell, TableHead, TableRow } from '@entur/table'
import { useSearchParam } from '../../hooks/useSearchParam'
import { Sort } from '../Sort'

function TableHeader({ columns }: { columns: TBoardsColumn[] }) {
    const sortParams = useSearchParam('sort')?.split(':')
    const sort = {
        column: sortParams?.[0] as TBoardsColumn,
        type: sortParams?.[1] as TSort,
    }
    return (
        <TableHead>
            <TableRow>
                {columns.map((column: TBoardsColumn) => (
                    <HeaderCell
                        key={column}
                        className="bg-[#E5E5E9] pl-2 font-medium"
                        aria-sort={
                            sort.column === column && sort.type
                                ? sort.type
                                : 'none'
                        }
                    >
                        <div className="flex flex-row items-center">
                            {BoardsColumns[column]}
                            <Sort column={column} />
                        </div>
                    </HeaderCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

export { TableHeader }
