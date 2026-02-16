'use client'

import { BreadcrumbItem, BreadcrumbNavigation } from '@entur/menu'
import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import Link from 'next/link'
import { BoardDB } from 'src/types/db-types/boards'
import { FolderDB } from 'src/types/db-types/folders'

function FolderBreadcrumbs({ folder }: { folder: FolderDB }) {
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

function BoardBreadcrumbs({ board }: { board: BoardDB }) {
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
    folder: FolderDB
    board: BoardDB
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

type BreadcrumbsNavProps =
    | { type: 'folder'; folder: FolderDB }
    | { type: 'board'; board: BoardDB }
    | { type: 'boardInFolder'; folder: FolderDB; board: BoardDB }

function BreadcrumbsNav(props: BreadcrumbsNavProps) {
    return (
        <div className="flex w-full flex-col justify-center">
            {props.type === 'folder' && (
                <FolderBreadcrumbs folder={props.folder} />
            )}
            {props.type === 'board' && <BoardBreadcrumbs board={props.board} />}
            {props.type === 'boardInFolder' && (
                <BoardInFolderBreadcrumbs
                    folder={props.folder}
                    board={props.board}
                />
            )}
        </div>
    )
}

export { BreadcrumbsNav }
