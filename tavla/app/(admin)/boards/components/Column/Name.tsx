import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { Column } from './Column'
import { BoardIcon, FolderIcon } from '@entur/icons'
import { TBoard, TOrganization } from 'types/settings'
import Link from 'next/link'
import { IconButton } from '@entur/button'

function BoardName({ board }: { board: TBoard }) {
    return (
        <Column column="name">
            <IconButton>
                <BoardIcon />
            </IconButton>
            <Link href={`/edit/${board.id}`} className="hover:underline">
                {board.meta.title ?? DEFAULT_BOARD_NAME}
            </Link>
        </Column>
    )
}

function FolderName({ folder }: { folder: TOrganization }) {
    return (
        <Column column="name">
            <IconButton>
                <FolderIcon />
            </IconButton>
            <Link href={`/folders/${folder.id}`} className="hover:underline">
                {folder.name ?? DEFAULT_BOARD_NAME}
            </Link>
        </Column>
    )
}

export { BoardName, FolderName }
