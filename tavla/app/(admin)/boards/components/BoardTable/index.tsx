'use client'
import { TableHeader } from 'app/(admin)/boards/components/TableHeader'
import { TableRows } from 'app/(admin)/boards/components/TableRows'
import { TBoardWithOrganizaion } from 'types/settings'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'

function BoardTable({
    boardsWithOrg,
}: {
    boardsWithOrg: TBoardWithOrganizaion[]
}) {
    if (isEmpty(boardsWithOrg))
        return (
            <IllustratedInfo
                title="Her var det tomt"
                description="Du har ikke laget noen tavler ennå"
                hasCreateButton={true}
            />
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
