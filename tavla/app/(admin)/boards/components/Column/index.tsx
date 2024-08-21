import { TBoardWithOrganizaion } from 'types/settings'
import { Actions } from './Actions'
import { LastModified } from './LastModified'
import { Name } from './Name'
import { Tags } from './Tags'
import { TTag } from 'types/meta'
import { TBoardsColumn } from 'app/(admin)/utils/types'
import { Organization } from './Organization'

function Column({
    boardWithOrg,
    column,
    tags,
}: {
    boardWithOrg: TBoardWithOrganizaion
    column: TBoardsColumn
    tags: TTag[]
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
        case 'tags':
            return <Tags board={boardWithOrg.board} allTags={tags} />
        default:
            return <div>Ukjent kolonne</div>
    }
}

export { Column }
