'use client'
import { TableRows } from 'app/(admin)/boards/components/TableRows'
import { TBoard } from 'types/settings'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'
import { Table, useSortableData } from '@entur/table'
import { TableHeader } from '../TableHeader'

function BoardTable({ boards }: { boards: TBoard[] }) {
    const { sortedData, getSortableHeaderProps, getSortableTableProps } =
        useSortableData(boards)

    if (isEmpty(boards))
        return (
            <IllustratedInfo
                title="Her var det tomt"
                description="Du har ikke laget noen tavler ennå"
            />
        )

    return (
        <Table {...getSortableTableProps}>
            <TableHeader getSortableHeaderProps={getSortableHeaderProps} />
            <TableRows boards={sortedData} />
        </Table>
    )
}
export { BoardTable }
