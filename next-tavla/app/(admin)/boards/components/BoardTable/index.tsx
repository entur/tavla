'use client'
import { TableRows } from 'app/(admin)/boards/components/TableRows'
import { TBoardWithOrganization } from 'types/settings'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'
import { Table, useSortableData } from '@entur/table'
import { TableHeader } from '../TableHeader'

function BoardTable({
    boardsWithOrgs,
}: {
    boardsWithOrgs: TBoardWithOrganization[]
}) {
    const { sortedData, getSortableHeaderProps, getSortableTableProps } =
        useSortableData(boardsWithOrgs)

    if (isEmpty(boardsWithOrgs))
        return (
            <IllustratedInfo
                title="Her var det tomt"
                description="Du har ikke laget noen tavler ennå"
            />
        )

    return (
        <Table {...getSortableTableProps}>
            <TableHeader getSortableHeaderProps={getSortableHeaderProps} />
            <TableRows boardsWithOrgs={sortedData} />
        </Table>
    )
}
export { BoardTable }
