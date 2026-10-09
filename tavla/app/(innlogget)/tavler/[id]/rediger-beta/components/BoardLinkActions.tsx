'use client'
import { CopyableText } from 'node_modules/@entur/alert'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'
import { ContactFormButton } from './ContactFormButton'
import { CustomUrl } from './CustomUrl/CustomUrl'
import { OpenBoard } from './OpenBoard'
import { RefreshBoard } from './RefreshBoard/RefreshBoard'

export function BoardLinkActions({ board }: { board: BoardDB }) {
    const boardLink = getBoardLinkClient(board.customUrl ?? board.id)

    return (
        <div className="sticky bottom-0 z-10 w-screen ml-[calc(50%-50vw)] bg-secondary py-4">
            <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-end sm:items-center gap-2">
                    <div className="flex min-w-0 flex-1 justify-start w-full gap-2 sm:items-center flex-col sm:flex-row">
                        <span className="flex-shrink-0">Lenke til tavla:</span>
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
                    <ContactFormButton />
                </div>
            </div>
        </div>
    )
}
