'use client'
import { OverflowMenu } from '@entur/menu'
import { Delete } from 'app/(admin)/oversikt/components/Column/Delete'
import { BoardDB } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'
import { Open } from '../Buttons/Open'
import { DuplicateBoard } from '../DuplicateBoard'
import { RefreshButton } from '../RefreshButton'

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
            <Open bid={board.id} type="button" />
            <RefreshButton board={board} />
            <Delete board={board} type="button" />
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
                <Open bid={board.id} type="button" />
                <RefreshButton board={board} />
            </div>
            <OverflowMenu>
                <DuplicateBoard
                    board={board}
                    folderid={folderid}
                    type="menuitem"
                />
                <Delete board={board} type="menuitem" />
            </OverflowMenu>
        </div>
    )
}

export { ActionsMenu }
