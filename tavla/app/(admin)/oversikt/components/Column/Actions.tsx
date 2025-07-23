import { DeleteFolder } from 'app/(admin)/components/Delete'
import { Copy } from 'app/(admin)/tavler/[id]/rediger/components/Buttons/Copy'
import { Open } from 'app/(admin)/tavler/[id]/rediger/components/Buttons/Open'
import { TBoard, TFolder } from 'types/settings'
import { ColumnWrapper } from './ColumnWrapper'
import { Delete } from './Delete'
import { EditBoard, EditFolder } from './Edit'
import { Move } from './Move'

function BoardActions({ board }: { board: TBoard }) {
    return (
        <ColumnWrapper column="actions">
            <div className="flex flex-row gap-1">
                <EditBoard bid={board.id} />
                <Copy bid={board.id} />
                <Open bid={board.id} />
                <Move board={board} />
                <Delete board={board} />
            </div>
        </ColumnWrapper>
    )
}

function FolderActions({ folder }: { folder: TFolder }) {
    return (
        <ColumnWrapper column="actions">
            <div className="flex flex-row gap-1">
                <EditFolder fid={folder.id} />
                <DeleteFolder folder={folder} type="icon" />
            </div>
        </ColumnWrapper>
    )
}

export { BoardActions, FolderActions }
