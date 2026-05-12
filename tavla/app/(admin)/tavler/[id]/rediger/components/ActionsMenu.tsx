'use client'
import { OverflowMenu } from '@entur/menu'
import { DeleteBoard } from 'app/(admin)/oversikt/components/Column/DeleteBoard'
import type { BoardDB } from 'src/types/db-types/boards'
import type { FolderDB } from 'src/types/db-types/folders'
import { Open } from './Buttons/Open'
import { DuplicateBoard } from './DuplicateBoard/DuplicateBoard'
import { RefreshButton } from './RefreshButton/RefreshButton'

function ActionsMenu({
    board,
    folderid,
}: {
    board: BoardDB
    folderid?: FolderDB['id']
}) {
    return (
        <>
            <ActionsMenuDesktop board={board} folderid={folderid} />
            <ActionsMenuPhone board={board} folderid={folderid} />
        </>
    )
}

function ActionsMenuDesktop({
    board,
    folderid,
}: {
    board: BoardDB
    folderid?: FolderDB['id']
}) {
    return (
        <div className="hidden flex-row gap-4 sm:flex md:items-center">
            <Open
                bid={board.customUrl ?? board.id}
                type="button"
                trackingLocation="board_page"
            />
            <RefreshButton board={board} />
            <DeleteBoard
                board={board}
                type="button"
                trackingLocation="board_page"
            />
            <OverflowMenu placement="bottom-left">
                <DuplicateBoard
                    board={board}
                    folderid={folderid}
                    type="menuitem"
                />
            </OverflowMenu>
        </div>
    )
}

function ActionsMenuPhone({
    board,
    folderid,
}: {
    board: BoardDB
    folderid?: FolderDB['id']
}) {
    return (
        <div className="hidden flex-row max-sm:flex md:hidden">
            <div className="flex flex-row gap-1">
                <Open
                    bid={board.customUrl ?? board.id}
                    type="button"
                    trackingLocation="board_page"
                />
                <RefreshButton board={board} />
            </div>
            <OverflowMenu>
                <DuplicateBoard
                    board={board}
                    folderid={folderid}
                    type="menuitem"
                />
                <DeleteBoard
                    board={board}
                    type="menuitem"
                    trackingLocation="board_page"
                />
            </OverflowMenu>
        </div>
    )
}

export { ActionsMenu }
