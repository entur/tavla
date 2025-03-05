import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import Link from 'next/link'
import { TBoard, TOrganization } from 'types/settings'
import { Column } from './Column'
import { Delete } from './Delete'
import { Open } from 'app/(admin)/edit/[id]/components/Buttons/Open'
import { Copy } from 'app/(admin)/edit/[id]/components/Buttons/Copy'
import { Tooltip } from '@entur/tooltip'
import { DeleteOrganization } from 'app/(admin)/components/DeleteOrganization'

function BoardActions({ board }: { board: TBoard }) {
    return (
        <Column column="actions">
            <div className="flex flex-row gap-1">
                <Edit bid={board.id} />
                <Copy bid={board.id} />
                <Open bid={board.id} />
                <Delete board={board} />
            </div>
        </Column>
    )
}

function FolderActions({ folder }: { folder: TOrganization }) {
    return (
        <Column column="actions">
            <div className="flex flex-row gap-1">
                <Edit fid={folder.id} />
                <DeleteOrganization organization={folder} type="icon" />
            </div>
        </Column>
    )
}

function Edit({ bid, fid }: { bid?: string; fid?: string }) {
    if (bid) {
        return (
            <Tooltip
                content="Rediger tavle"
                placement="bottom"
                id="tooltip-edit-board"
            >
                <IconButton
                    as={Link}
                    aria-label="Rediger tavle"
                    href={`/edit/${bid}`}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
        )
    } else if (fid) {
        return (
            <Tooltip
                content="Rediger mappe"
                placement="bottom"
                id="tooltip-edit-board"
            >
                <IconButton
                    as={Link}
                    aria-label="Rediger mappe"
                    href={`/folders/${fid}`}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
        )
    }
}

export { BoardActions, FolderActions }
