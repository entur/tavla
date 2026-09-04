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
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-end sm:items-center gap-2">
                <div className="flex min-w-0 flex-1 justify-start w-full gap-2 sm:items-center flex-col sm:flex-row">
                    <div className="flex-shrink-0">Lenke til tavla:</div>
                    <CopyableText
                        className="p-0 m-0 min-w-0 flex-1"
                        size="small"
                    >
                        {boardLink}
                    </CopyableText>
                </div>
                <CustomUrl bid={board.id} customUrl={board.customUrl} />
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-end">
                <RefreshBoard board={board} />
                <OpenBoard board={board} />
            </div>
        </div>
    )
}
