import { DEFAULT_BOARD_COLUMNS, TTableColumn } from 'app/(admin)/utils/types'
import { ColumnHeader } from './ColumnHeader'

function TableHeader() {
    const columns = DEFAULT_BOARD_COLUMNS
    return (
        <>
            {columns.map((column: TTableColumn) => (
                <ColumnHeader key={column} column={column} />
            ))}
        </>
    )
}

export { TableHeader }
