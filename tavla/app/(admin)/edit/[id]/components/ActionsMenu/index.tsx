'use client'
import { OverflowMenu } from '@entur/menu'
import { TBoard, TOrganizationID } from 'types/settings'
import { DuplicateBoard } from '../DuplicateBoard'
import { Delete } from 'app/(admin)/boards/components/Column/Delete'

function ActionsMenu({ board, oid }: { board: TBoard; oid?: TOrganizationID }) {
    return (
        <>
            <OverflowActionsMenu board={board} oid={oid} />
            <ButtonsMenu board={board} oid={oid} />
        </>
    )
}

function OverflowActionsMenu({
    board,
    oid,
}: {
    board: TBoard
    oid?: TOrganizationID
}) {
    return (
        <div className="hidden md:flex">
            <OverflowMenu position="left">
                <DuplicateBoard board={board} oid={oid} />
                <Delete board={board} type="action" />
            </OverflowMenu>
        </div>
    )
}

function ButtonsMenu({ board, oid }: { board: TBoard; oid?: TOrganizationID }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:hidden">
            <DuplicateBoard board={board} oid={oid} type="button" />
            <Delete board={board} type="button" />
        </div>
    )
}

export { ActionsMenu }
