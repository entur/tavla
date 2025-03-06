import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import { Column } from './Column'
import { BoardIcon, FolderIcon } from '@entur/icons'
import { TBoard, TOrganization } from 'types/settings'
import Link from 'next/link'

function BoardName({ board }: { board: TBoard }) {
    return (
        <Column column="name">
            <p className="flex flex-row gap-1 items-center">
                <BoardIcon className="!top-0" aria-label="Tavle-ikon" />
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
                <FolderIcon className="!top-0" aria-label="Mappe-ikon" />
                <Link href={`/boards/${folder.id}`} className="hover:underline">
                    {folder.name ?? DEFAULT_FOLDER_NAME}
                </Link>
            </p>
        </Column>
    )
}

export { BoardName, FolderName }
