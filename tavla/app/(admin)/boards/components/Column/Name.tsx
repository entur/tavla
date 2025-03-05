import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { Column } from './Column'
import { BoardIcon, FolderIcon } from '@entur/icons'
import { TBoard, TOrganization } from 'types/settings'
import Link from 'next/link'

function BoardName({ board }: { board: TBoard }) {
    return (
        <Column column="name">
            <p className="flex flex-row gap-1 items-center">
                <BoardIcon inline className="!top-0" />
                <Link href={`/edit/${board.id}`} className="hover:underline">
                    {board.meta.title ?? DEFAULT_BOARD_NAME}
                </Link>
            </p>
        </Column>
    )
}

function FolderName({ folder }: { folder: TOrganization }) {
    return (
        <Column column="name">
            <p className="flex flex-row gap-1 items-center">
                <FolderIcon inline className="!top-0" />
                <Link href={`/boards/${folder.id}`} className="hover:underline">
                    {folder.name ?? DEFAULT_BOARD_NAME}
                </Link>
            </p>
        </Column>
    )
}

export { BoardName, FolderName }
