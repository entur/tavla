'use client'
import { TableHeader } from 'app/(admin)/oversikt/components/TableHeader'
import { TableRows } from 'app/(admin)/oversikt/components/TableRows'
import { Folder, TableColumns } from 'app/(admin)/utils/types'
import { BoardDB } from 'types/db-types/boards'

type BoardTableProps = {
    folders?: Folder[]
    boards: BoardDB[]
}

function BoardTable({ folders, boards }: BoardTableProps) {
    const numOfColumns = Object.keys(TableColumns).length

    return (
        <div
            className="grid items-center overflow-x-auto"
            style={{
                gridTemplateColumns: `repeat(${numOfColumns},auto)`,
            }}
        >
            <TableHeader />
            <TableRows folders={folders ?? []} boards={boards} />
        </div>
    )
}
export { BoardTable }
