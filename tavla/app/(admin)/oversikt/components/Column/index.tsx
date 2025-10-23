import { TTableColumn } from 'app/(admin)/utils/types'
import { BoardDB } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'
import { BoardActions, FolderActions } from './Actions'
import { LastModified } from './LastModified'
import { BoardName, FolderName } from './Name'

type ColumnProps = {
    board?: BoardDB
    folder?: FolderDB
    column: TTableColumn
    folderBoardCount?: number
    folderLastUpdated?: number
}

function Column({
    board,
    folder,
    column,
    folderBoardCount,
    folderLastUpdated,
}: ColumnProps) {
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
                return (
                    <LastModified
                        timestamp={
                            folderLastUpdated ? folderLastUpdated : undefined
                        }
                    />
                )
        }
    }
}

export { Column }
