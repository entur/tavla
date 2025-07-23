'use client'

import { BreadcrumbItem, BreadcrumbNavigation } from '@entur/menu'
import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import Link from 'next/link'
import { TBoard, TFolder } from 'types/settings'

function FolderBreadcrumbs({ folder }: { folder: TFolder }) {
    return (
        <BreadcrumbNavigation>
            <BreadcrumbItem as={Link} href="/oversikt">
                Mine tavler
            </BreadcrumbItem>
            <BreadcrumbItem as={Link} href={`/mapper/${folder?.id}`}>
                {folder?.name ?? DEFAULT_FOLDER_NAME}
            </BreadcrumbItem>
        </BreadcrumbNavigation>
    )
}

function BoardBreadcrumbs({ board }: { board: TBoard }) {
    return (
        <BreadcrumbNavigation>
            <BreadcrumbItem as={Link} href="/oversikt">
                Mine tavler
            </BreadcrumbItem>
            <BreadcrumbItem as={Link} href={`/tavler/${board?.id}/rediger`}>
                {board?.meta.title ?? DEFAULT_BOARD_NAME}
            </BreadcrumbItem>
        </BreadcrumbNavigation>
    )
}

function BoardInFolderBreadcrumbs({
    folder,
    board,
}: {
    folder?: TFolder
    board?: TBoard
}) {
    return (
        <BreadcrumbNavigation>
            <BreadcrumbItem as={Link} href="/oversikt">
                Mine tavler
            </BreadcrumbItem>
            <BreadcrumbItem as={Link} href={`/mapper/${folder?.id}`}>
                {folder?.name ?? DEFAULT_FOLDER_NAME}
            </BreadcrumbItem>
            <BreadcrumbItem as={Link} href={`/tavler/${board?.id}/rediger`}>
                {board?.meta.title ?? DEFAULT_BOARD_NAME}
            </BreadcrumbItem>
        </BreadcrumbNavigation>
    )
}

function BreadcrumbsNav({
    folder,
    board,
}: {
    folder?: TFolder
    board?: TBoard
}) {
    if (board && folder) {
        return <BoardInFolderBreadcrumbs folder={folder} board={board} />
    }
    if (folder) {
        return <FolderBreadcrumbs folder={folder} />
    }
    if (board) {
        return <BoardBreadcrumbs board={board} />
    }
}

export { BreadcrumbsNav }
