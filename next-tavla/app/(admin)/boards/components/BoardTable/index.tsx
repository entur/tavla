'use client'
import { TableHeader } from 'app/(admin)/boards/components/TableHeader'
import { TableRows } from 'app/(admin)/boards/components/TableRows'
import { TBoard } from 'types/settings'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'
import { DEFAULT_BOARD_COLUMNS } from 'app/(admin)/utils/types'
import { Table, TableBody } from '@entur/table'

function BoardTable({ boards }: { boards: TBoard[] }) {
    if (isEmpty(boards))
        return (
            <IllustratedInfo
                title="Her var det tomt"
                description="Du har ikke laget noen tavler ennå"
            />
        )

    return (
        <Table>
            <TableHeader columns={DEFAULT_BOARD_COLUMNS} />
            <TableBody className="[&>*:nth-child(even)]:bg-secondary">
                <TableRows boards={boards} />
            </TableBody>
        </Table>
    )
}
export { BoardTable }
