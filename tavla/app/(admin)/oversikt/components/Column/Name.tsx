import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import { ColumnWrapper } from './ColumnWrapper'
import { BoardIcon, FolderIcon } from '@entur/icons'
import { TBoard, TFolder } from 'types/settings'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SkeletonRectangle } from '@entur/loader'
import * as Sentry from '@sentry/nextjs'
import { getNumberOfBoardsInFolder } from '../../utils/actions'

function BoardName({ board }: { board: TBoard }) {
    return (
        <ColumnWrapper column="name">
            <div className="flex flex-row gap-2 items-center">
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

function FolderName({ folder }: { folder: TFolder }) {
    const [boardsInFolderCount, setBoardsInFolderCount] = useState<
        number | undefined
    >()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchNumberOfBoards(id?: string) {
            try {
                const boardsInFolderCount = await getNumberOfBoardsInFolder(
                    id ?? undefined,
                )

                setBoardsInFolderCount(boardsInFolderCount)
            } catch (error) {
                Sentry.captureException(error)
                setBoardsInFolderCount(undefined)
            } finally {
                setIsLoading(false)
            }
        }

        fetchNumberOfBoards(folder.id)
    }, [folder.id])

    return (
        <ColumnWrapper column="name">
            <div className="flex flex-row gap-2 items-center">
                <FolderIcon className="!top-0" aria-label="Mappe-ikon" />
                <Link href={`/mapper/${folder.id}`} className="hover:underline">
                    {folder.name ?? DEFAULT_FOLDER_NAME}
                </Link>
                {isLoading ? (
                    <SkeletonRectangle width="1rem" />
                ) : (
                    boardsInFolderCount != undefined && (
                        <>({boardsInFolderCount})</>
                    )
                )}
            </div>
        </ColumnWrapper>
    )
}

export { BoardName, FolderName }
