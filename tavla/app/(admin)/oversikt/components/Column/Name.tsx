import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import { ColumnWrapper } from './ColumnWrapper'
import { BoardIcon, FolderIcon } from '@entur/icons'
import { TBoard, TOrganization } from 'types/settings'
import Link from 'next/link'

function BoardName({ board }: { board: TBoard }) {
    return (
        <ColumnWrapper column="name">
            <p className="flex flex-row gap-1 items-center">
                <BoardIcon className="!top-0" aria-label="Tavle-ikon" />
                <Link
                    href={`/tavler/${board.id}/rediger`}
                    className="hover:underline"
                >
                    {board.meta.title ?? DEFAULT_BOARD_NAME}
                </Link>
            </p>
        </ColumnWrapper>
    )
}

function FolderName({ folder }: { folder: TOrganization }) {
    return (
        <ColumnWrapper column="name">
            <p className="flex flex-row gap-1 items-center">
                <FolderIcon className="!top-0" aria-label="Mappe-ikon" />
                <Link href={`/mapper/${folder.id}`} className="hover:underline">
                    {folder.name ?? DEFAULT_FOLDER_NAME}
                </Link>
            </p>
        </ColumnWrapper>
    )
}

export { BoardName, FolderName }
