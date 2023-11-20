import { TBoard } from 'types/settings'
import { formatTimestamp } from 'Admin/utils/time'

function SaveStatus({ board }: { board: TBoard }) {
    return <div>Sist lagret: {formatTimestamp(board.meta?.dateModified)}</div>
}

export { SaveStatus }
