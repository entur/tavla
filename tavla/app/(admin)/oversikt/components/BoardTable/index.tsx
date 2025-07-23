'use client'
import { TableHeader } from 'app/(admin)/oversikt/components/TableHeader'
import { TableRows } from 'app/(admin)/oversikt/components/TableRows'
import { TableColumns } from 'app/(admin)/utils/types'
import { TBoard, TFolder } from 'types/settings'

function BoardTable({
    folders,
    boards,
}: {
    folders?: TFolder[]
    boards: TBoard[]
}) {
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
