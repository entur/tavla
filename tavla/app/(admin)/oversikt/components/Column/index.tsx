import { TTableColumn } from 'app/(admin)/utils/types'
import { TBoard, TFolder } from 'types/settings'
import { BoardActions, FolderActions } from './Actions'
import { LastModified } from './LastModified'
import { BoardName, FolderName } from './Name'

type ColumnProps = {
    board?: TBoard
    folder?: TFolder
    column: TTableColumn
    folderBoardCount?: number
}

function Column({ board, folder, column, folderBoardCount }: ColumnProps) {
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
                return <FolderName folder={folder} count={folderBoardCount} />
            case 'actions':
                return <FolderActions folder={folder} />
            case 'lastModified':
                return <LastModified />
        }
    }
}

export { Column }
