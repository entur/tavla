import { TBoard } from 'types/settings'
import { Actions } from './Actions'
import { LastModified } from './LastModified'
import { Link } from './Link'
import { Name } from './Name'
import { TBoardsColumn } from 'Admin/types/boards'
import { Tags } from './Tags'

function Column({ board, column }: { board: TBoard; column: TBoardsColumn }) {
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
            return <Tags tags={board.meta?.tags ?? []} boardId={board.id} />
        default:
            return <div>Ukjent kolonne</div>
    }
}

export { Column }
