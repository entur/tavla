'use client'
import { OverflowMenu } from '@entur/menu'
import { DeleteBoard } from 'app/(innlogget)/oversikt/components/Column/DeleteBoard'
import type { BoardDB } from 'src/types/db-types/boards'
import type { FolderDB } from 'src/types/db-types/folders'
import { Open } from '../../rediger/components/Buttons/Open'
import { DuplicateBoard } from '../../rediger/components/DuplicateBoard/DuplicateBoard'

/**
 * Header actions for the board (open / duplicate / delete). Lives in a client
 * boundary because `OverflowMenu` relies on React context. Note: the legacy
 * "Publiser tavle" action is intentionally absent here — pushing changes to the
 * screen now lives next to the preview as "Oppdater skjermen nå" (problem #6).
 */
function BoardActions({
    board,
    folderid,
}: {
    board: BoardDB
    folderid?: FolderDB['id']
}) {
    return (
        <div className="flex flex-row items-center gap-4">
            <Open
                bid={board.customUrl ?? board.id}
                type="button"
                trackingLocation="board_page"
            />
            <OverflowMenu placement="bottom-left">
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

export { BoardActions }
