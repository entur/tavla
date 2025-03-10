'use client'
import { TableHeader } from 'app/(admin)/boards/components/TableHeader'
import { TableRows } from 'app/(admin)/boards/components/TableRows'
import { TBoard, TOrganization } from 'types/settings'
import { TableColumns } from 'app/(admin)/utils/types'

function BoardTable({
    folders,
    boards,
}: {
    folders?: TOrganization[]
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
