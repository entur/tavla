'use client'
import { OverflowMenu } from '@entur/menu'
import { DeleteBoard } from 'app/(innlogget)/oversikt/components/Column/DeleteBoard'
import { Open } from 'app/(innlogget)/oversikt/components/Column/Open'
import type { BoardDB } from 'src/types/db-types/boards'
import { RefreshButton } from './RefreshButton/RefreshButton'

function ActionsMenu({ board }: { board: BoardDB }) {
    return (
        <>
            <ActionsMenuDesktop board={board} />
            <ActionsMenuPhone board={board} />
        </>
    )
}

function ActionsMenuDesktop({ board }: { board: BoardDB }) {
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
        </div>
    )
}

function ActionsMenuPhone({ board }: { board: BoardDB }) {
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
