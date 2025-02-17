'use client'
import { TableHeader } from 'app/(root)/(admin)/boards/components/TableHeader'
import { TableRows } from 'app/(root)/(admin)/boards/components/TableRows'
import { TBoardWithOrganizaion } from 'types/settings'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'app/(root)/(admin)/components/IllustratedInfo'
import { PrimaryButton } from '@entur/button'
import Link from 'next/link'
import { AddIcon } from '@entur/icons'
import { CreateBoard } from 'app/(root)/(admin)/components/CreateBoard'

function BoardTable({
    boardsWithOrg,
}: {
    boardsWithOrg: TBoardWithOrganizaion[]
}) {
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
                gridTemplateColumns: `repeat(5,auto)`,
            }}
        >
            <TableHeader />
            <TableRows boardsWithOrg={boardsWithOrg} />
        </div>
    )
}
export { BoardTable }
