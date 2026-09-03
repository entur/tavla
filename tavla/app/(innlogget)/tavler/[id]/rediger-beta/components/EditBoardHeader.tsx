'use client'
import { CopyableText } from 'node_modules/@entur/alert'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'
import { CustomUrl } from './BoardLink/CustomUrl'
import { OpenBoard } from './BoardLink/OpenBoard'
import { RefreshBoard } from './RefreshBoard/RefreshBoard'

export function BoardLinkActions({ board }: { board: BoardDB }) {
    const boardLink = getBoardLinkClient(board.customUrl ?? board.id)

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-2">
                <div className="flex min-w-0 flex-1 justify-start w-full gap-2 items-center">
                    <div className="flex-shrink-0">Lenke til tavla:</div>
                    <CopyableText className="p-0 m-0" size="small">
                        {boardLink}
                    </CopyableText>
                </div>
                <CustomUrl bid={board.id} customUrl={board.customUrl} />
            </div>

            <div className="flex items-center gap-4">
                <RefreshBoard board={board} />
                <OpenBoard board={board} />
            </div>
        </div>
    )
}
