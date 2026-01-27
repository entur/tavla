import { DeleteFolder } from 'app/(admin)/components/Delete'
import { TableItem } from 'app/(admin)/oversikt/components/BoardTable'
import { Copy } from 'app/(admin)/tavler/[id]/rediger/components/Buttons/Copy'
import { Open } from 'app/(admin)/tavler/[id]/rediger/components/Buttons/Open'
import { Delete } from './Delete'
import { EditBoard, EditFolder } from './Edit'
import { Move } from './Move'

function TableActions({ data }: { data: TableItem }) {
    switch (data.type) {
        case 'board':
            return (
                <div className="flex flex-row gap-1">
                    <EditBoard board={data.board} />
                    <Copy
                        board={data.board}
                        bid={data.board.id}
                        trackingLocation="admin_table"
                    />
                    <Open
                        board={data.board}
                        bid={data.board.id}
                        trackingLocation="admin_table"
                    />
                    <Move board={data.board} />
                    <Delete board={data.board} trackingLocation="admin_table" />
                </div>
            )
        case 'folder':
            return (
                <div className="flex flex-row gap-1">
                    <EditFolder fid={data.folder.id} name={data.folder.name} />
                    <DeleteFolder folder={data.folder} type="icon" />
                </div>
            )
    }
}

export { TableActions }
