import { TBoard, TOrganization } from 'types/settings'
import { LastModified } from './LastModified'
import { TBoardsColumn } from 'app/(admin)/utils/types'
import { NumOfBoards } from './NumOfBoards'
import { BoardName, FolderName } from './Name'
import { BoardActions, FolderActions } from './Actions'

function Column({
    boardWithoutFolder,
    folder,
    column,
}: {
    boardWithoutFolder?: TBoard
    folder?: TOrganization
    column: TBoardsColumn
}) {
    if (boardWithoutFolder) {
        switch (column) {
            case 'name':
                return <BoardName board={boardWithoutFolder} />
            case 'actions':
                return <BoardActions board={boardWithoutFolder} />
            case 'numOfBoards':
                return <NumOfBoards />
            case 'lastModified':
                return (
                    <LastModified
                        timestamp={boardWithoutFolder.meta?.dateModified}
                    />
                )

            default:
                return <div>Ukjent kolonne</div>
        }
    } else if (folder) {
        switch (column) {
            case 'name':
                return <FolderName folder={folder} />
            case 'actions':
                return <FolderActions folder={folder} />
            case 'numOfBoards':
                return <NumOfBoards folder={folder} />
            case 'lastModified':
                return <LastModified />

            default:
                return <div>Ukjent kolonne</div>
        }
    }
}

export { Column }
