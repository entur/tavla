import { BoardIcon, FolderIcon } from '@entur/icons'
import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import Link from 'next/link'
import { BoardDB } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'
import { ColumnWrapper } from './ColumnWrapper'

function BoardName({ board }: { board: BoardDB }) {
    return (
        <ColumnWrapper column="name">
            <div className="flex flex-row items-center gap-2">
                <BoardIcon className="!top-0" aria-label="Tavle-ikon" />
                <Link
                    href={`/tavler/${board.id}/rediger`}
                    className="hover:underline"
                >
                    {board.meta.title ?? DEFAULT_BOARD_NAME}
                </Link>
            </div>
        </ColumnWrapper>
    )
}

function FolderName({ folder, count }: { folder: FolderDB; count?: number }) {
    return (
        <ColumnWrapper column="name">
            <div className="flex flex-row items-center gap-2">
                <FolderIcon className="!top-0" aria-label="Mappe-ikon" />
                <Link href={`/mapper/${folder.id}`} className="hover:underline">
                    {folder.name ?? DEFAULT_FOLDER_NAME}
                </Link>
                {typeof count === 'number' && <>({count})</>}
            </div>
        </ColumnWrapper>
    )
}

export { BoardName, FolderName }
