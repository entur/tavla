import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import { ColumnWrapper } from './ColumnWrapper'
import { BoardIcon, FolderIcon } from '@entur/icons'
import { TBoard, TOrganization } from 'types/settings'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SkeletonRectangle } from '@entur/loader'
import * as Sentry from '@sentry/nextjs'

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

function FolderName({ folder }: { folder: TOrganization }) {
    const [boardsInFolderCount, setBoardsInFolderCount] = useState<
        number | undefined
    >()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCount = async () => {
            try {
                setIsLoading(true)
                const res = await fetch(
                    `/api/folder-board-count?folderId=${folder.id}`,
                )
                const data = await res.json()
                setBoardsInFolderCount(data.boardsInFolderCount)
            } catch (error) {
                Sentry.captureException(error)
                setBoardsInFolderCount(undefined)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCount()
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
                    boardsInFolderCount && <>({boardsInFolderCount})</>
                )}
            </div>
        </ColumnWrapper>
    )
}

export { BoardName, FolderName }
