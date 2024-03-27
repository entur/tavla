import { TBoardsColumn } from 'app/(admin)/utils/types'
import { ColumnHeader } from './ColumnHeader'

function TableHeader({ columns }: { columns: TBoardsColumn[] }) {
    return (
        <>
            {columns.map((column: TBoardsColumn) => (
                <ColumnHeader key={column} column={column} />
            ))}
        </>
    )
}

export { TableHeader }
