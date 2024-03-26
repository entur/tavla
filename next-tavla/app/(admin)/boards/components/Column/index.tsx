import { TBoard } from 'types/settings'
import { Actions } from './Actions'
import { LastModified } from './LastModified'
import { Link } from './Link'
import { Name } from './Name'
import { Tags } from './Tags'
import { TTag } from 'types/meta'
import { TBoardsColumn } from 'app/(admin)/utils/types'

function Column({
    board,
    column,
    tags,
}: {
    board: TBoard
    column: TBoardsColumn
    tags: TTag[]
}) {
    switch (column) {
        case 'name':
            return <Name name={board.meta?.title} />
        case 'url':
            return <Link bid={board.id} />
        case 'actions':
            return <Actions board={board} />
        case 'lastModified':
            return <LastModified timestamp={board.meta?.dateModified} />
        case 'tags':
            return <Tags board={board} allTags={tags} />
        default:
            return <div>Ukjent kolonne</div>
    }
}

export { Column }
