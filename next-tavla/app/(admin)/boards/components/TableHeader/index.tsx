import { DEFAULT_BOARD_COLUMNS, TBoardsColumn } from 'app/(admin)/utils/types'
import { ColumnHeader } from './ColumnHeader'

function TableHeader() {
    const columns = DEFAULT_BOARD_COLUMNS
    return (
        <>
            {columns.map((column: TBoardsColumn) => (
                <ColumnHeader key={column} column={column} />
            ))}
        </>
    )
}

export { TableHeader }
