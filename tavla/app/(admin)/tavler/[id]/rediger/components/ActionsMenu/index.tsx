'use client'
import { OverflowMenu } from '@entur/menu'
import { BoardDB } from 'types/db-types/boards'
import { FolderIdDB } from 'types/db-types/folders'
import { DuplicateBoard } from '../DuplicateBoard'

function ActionsMenu({
    board,
    folderid,
}: {
    board: BoardDB
    folderid?: FolderIdDB
}) {
    return (
        <>
            <OverflowActionsMenu board={board} folderid={folderid} />
            <ButtonsMenu board={board} folderid={folderid} />
        </>
    )
}

function OverflowActionsMenu({
    board,
    folderid,
}: {
    board: BoardDB
    folderid?: FolderIdDB
}) {
    return (
        <div className="hidden md:flex">
            <OverflowMenu placement="bottom-left">
                <DuplicateBoard board={board} folderid={folderid} />
            </OverflowMenu>
        </div>
    )
}

function ButtonsMenu({
    board,
    folderid,
}: {
    board: BoardDB
    folderid?: FolderIdDB
}) {
    return (
        <div className="flex flex-col gap-4 md:hidden md:flex-row md:items-center">
            <DuplicateBoard board={board} folderid={folderid} />
        </div>
    )
}

export { ActionsMenu }
