'use client'
import { TableHeader } from 'app/(admin)/boards/components/TableHeader'
import { TableRows } from 'app/(admin)/boards/components/TableRows'
import { TBoardWithOrganizaion } from 'types/settings'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'
import { PrimaryButton } from '@entur/button'
import Link from 'next/link'
import { AddIcon } from '@entur/icons'
import { CreateBoard } from 'app/(admin)/components/CreateBoard'
import { BoardsColumns } from 'app/(admin)/utils/types'

function BoardTable({
    boardsWithOrg,
}: {
    boardsWithOrg: TBoardWithOrganizaion[]
}) {
    const numOfBoardColumns = Object.keys(BoardsColumns).length
    if (isEmpty(boardsWithOrg))
        return (
            <IllustratedInfo
                title="Her var det tomt!"
                description="Du har ikke laget noen tavler ennå"
            >
                <PrimaryButton as={Link} href="?board">
                    Opprett tavle <AddIcon /> <CreateBoard />
                </PrimaryButton>
            </IllustratedInfo>
        )

    return (
        <div
            className="grid items-center overflow-x-auto"
            style={{
                gridTemplateColumns: `repeat(${numOfBoardColumns},auto)`,
            }}
        >
            <TableHeader />
            <TableRows boardsWithOrg={boardsWithOrg} />
        </div>
    )
}
export { BoardTable }
