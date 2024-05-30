import {
    BoardsColumns,
    DEFAULT_BOARD_COLUMNS,
    SortableColumns,
    SortableDataKeys,
    TBoardsColumn,
} from 'app/(admin)/utils/types'
import {
    HeaderCell,
    SortableHeaderProps,
    SortableHeaderReturnProps,
    TableHead,
    TableRow,
} from '@entur/table'

function TableHeader({
    getSortableHeaderProps,
}: {
    getSortableHeaderProps: (
        args: SortableHeaderProps,
    ) => SortableHeaderReturnProps
}) {
    const isSortable = (col: string): col is SortableColumns => {
        return col in SortableDataKeys
    }

    return (
        <TableHead>
            <TableRow className="h-10">
                {DEFAULT_BOARD_COLUMNS.map((column: TBoardsColumn) => {
                    return (
                        <HeaderCell
                            {...(isSortable(column) &&
                                getSortableHeaderProps({
                                    name: SortableDataKeys[column],
                                }))}
                            key={column}
                            className="bg-grey70 font-medium text-left pl-2"
                        >
                            {BoardsColumns[column]}
                        </HeaderCell>
                    )
                })}
            </TableRow>
        </TableHead>
    )
}

export { TableHeader }
