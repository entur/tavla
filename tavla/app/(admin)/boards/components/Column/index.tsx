import { TBoard, TOrganization } from 'types/settings'
import { LastModified } from './LastModified'
import { TTableColumn } from 'app/(admin)/utils/types'
import { BoardName, FolderName } from './Name'
import { BoardActions, FolderActions } from './Actions'

function Column({
    boardWithoutFolder,
    folder,
    column,
}: {
    boardWithoutFolder?: TBoard
    folder?: TOrganization
    column: TTableColumn
}) {
    if (boardWithoutFolder) {
        switch (column) {
            case 'name':
                return <BoardName board={boardWithoutFolder} />
            case 'actions':
                return <BoardActions board={boardWithoutFolder} />
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
            case 'lastModified':
                return <LastModified />

            default:
                return <div>Ukjent kolonne</div>
        }
    }
}

export { Column }
