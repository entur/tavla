import { TTableColumn } from 'app/(admin)/utils/types'
import { ColumnHeader } from './ColumnHeader'

function TableHeader({ columns }: { columns: TTableColumn[] }) {
    return (
        <>
            {columns.map((column: TTableColumn) => (
                <ColumnHeader key={column} column={column} />
            ))}
        </>
    )
}

export { TableHeader }
