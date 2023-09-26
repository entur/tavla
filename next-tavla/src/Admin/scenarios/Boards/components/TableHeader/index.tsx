import { TBoardsColumn } from 'Admin/types/boards'
import { ColumnHeader } from './ColumnHeader'

function TableHeader({ columnOrder }: { columnOrder: TBoardsColumn[] }) {
    return (
        <>
            {columnOrder.map((column: TBoardsColumn) => (
                <ColumnHeader key={column} column={column} />
            ))}
        </>
    )
}

export { TableHeader }
