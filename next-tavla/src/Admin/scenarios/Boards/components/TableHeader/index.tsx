import { TBoardsColumn } from 'Admin/types/boards'
import { ColumnHeader } from './ColumnHeader'

function TableHeader({
    columns,
    columnOrder,
}: {
    columns: TBoardsColumn[]
    columnOrder: TBoardsColumn[]
}) {
    return (
        <>
            {columns
                .sort((a, b) => columnOrder.indexOf(a) - columnOrder.indexOf(b))
                .map((column: TBoardsColumn) => (
                    <ColumnHeader key={column} column={column} />
                ))}
        </>
    )
}

export { TableHeader }
