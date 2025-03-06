'use client'
import { TableHeader } from 'app/(admin)/boards/components/TableHeader'
import { TableRows } from 'app/(admin)/boards/components/TableRows'
import { TBoard, TOrganization } from 'types/settings'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'
import { TableColumns } from 'app/(admin)/utils/types'

function BoardTable({
    folders,
    boards,
}: {
    folders?: TOrganization[]
    boards: TBoard[]
}) {
    const numOfColumns = Object.keys(TableColumns).length

    if (isEmpty(folders) && isEmpty(boards))
        return (
            <IllustratedInfo
                title="Her var det tomt!"
                description="Du har ikke laget noen tavler eller mapper ennå."
            ></IllustratedInfo>
        )

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
