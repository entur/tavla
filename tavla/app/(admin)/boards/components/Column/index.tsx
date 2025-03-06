import { TBoard, TOrganization } from 'types/settings'
import { LastModified } from './LastModified'
import { TTableColumn } from 'app/(admin)/utils/types'
import { BoardName, FolderName } from './Name'
import { BoardActions, FolderActions } from './Actions'

function Column({
    board,
    folder,
    column,
}: {
    board?: TBoard
    folder?: TOrganization
    column: TTableColumn
}) {
    if (board) {
        switch (column) {
            case 'name':
                return <BoardName board={board} />
            case 'actions':
                return <BoardActions board={board} />
            case 'lastModified':
                return <LastModified timestamp={board.meta?.dateModified} />
        }
    } else if (folder) {
        switch (column) {
            case 'name':
                return <FolderName folder={folder} />
            case 'actions':
                return <FolderActions folder={folder} />
            case 'lastModified':
                return <LastModified />
        }
    }
}

export { Column }
