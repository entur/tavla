import { TBoard } from 'types/settings'
import { TBoardsColumn } from '../../utils/reducer'
import { Actions } from './Actions'
import { LastModified } from './LastModified'
import { Link } from './Link'
import { Name } from './Name'

function Column({ board, column }: { board: TBoard; column: TBoardsColumn }) {
    switch (column) {
        case 'name':
            return <Name name={board.meta?.title} />
        case 'url':
            return <Link bid={board.id} />
        case 'actions':
            return <Actions board={board} />
        case 'modified':
            return <LastModified timestamp={board.meta?.dateModified} />
        default:
            return <div>Ukjent kolonne</div>
    }
}

export { Column }
