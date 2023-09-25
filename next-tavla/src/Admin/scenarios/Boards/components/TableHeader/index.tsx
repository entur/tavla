import { TBoardsColumn } from 'Admin/types/boards'
import { ColumnHeader } from './ColumnHeader'

function TableHeader({ columns }: { columns: TBoardsColumn[] }) {
    return (
        <>
            {columns.includes('name') && <ColumnHeader column="name" />}
            {columns.includes('url') && <ColumnHeader column="url" />}
            {columns.includes('actions') && <ColumnHeader column="actions" />}
            {columns.includes('lastModified') && (
                <ColumnHeader column="lastModified" />
            )}
        </>
    )
}

export { TableHeader }
