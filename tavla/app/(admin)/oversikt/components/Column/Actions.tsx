import { TBoard, TOrganization } from 'types/settings'
import { ColumnWrapper } from './ColumnWrapper'
import { Delete } from './Delete'
import { DeleteOrganization } from 'app/(admin)/components/DeleteOrganization'
import { EditBoard, EditFolder } from './Edit'
import { Copy } from 'app/(admin)/tavler/[id]/rediger/components/Buttons/Copy'
import { Open } from 'app/(admin)/tavler/[id]/rediger/components/Buttons/Open'

function BoardActions({ board }: { board: TBoard }) {
    return (
        <ColumnWrapper column="actions">
            <div className="flex flex-row gap-1">
                <EditBoard bid={board.id} />
                <Copy bid={board.id} />
                <Open bid={board.id} />
                <Delete board={board} />
            </div>
        </ColumnWrapper>
    )
}

function FolderActions({ folder }: { folder: TOrganization }) {
    return (
        <ColumnWrapper column="actions">
            <div className="flex flex-row gap-1">
                <EditFolder fid={folder.id} />
                <DeleteOrganization organization={folder} type="icon" />
            </div>
        </ColumnWrapper>
    )
}

export { BoardActions, FolderActions }
