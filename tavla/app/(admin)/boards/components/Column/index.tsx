import { TBoardWithOrganizaion } from 'types/settings'
import { Actions } from './Actions'
import { LastModified } from './LastModified'
import { Name } from './Name'
import { TBoardsColumn } from 'app/(admin)/utils/types'
import { Organization } from './Organization'

function Column({
    boardWithOrg,
    column,
}: {
    boardWithOrg: TBoardWithOrganizaion
    column: TBoardsColumn
}) {
    switch (column) {
        case 'name':
            return <Name board={boardWithOrg.board} />
        case 'actions':
            return <Actions board={boardWithOrg.board} />
        case 'lastModified':
            return (
                <LastModified
                    timestamp={boardWithOrg.board.meta?.dateModified}
                />
            )
        case 'organization':
            return <Organization organization={boardWithOrg.organization} />
        default:
            return <div>Ukjent kolonne</div>
    }
}

export { Column }
