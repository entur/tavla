'use client'
import { Heading1, Paragraph } from '@entur/typography'
import { CopyableText } from 'node_modules/@entur/alert'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'
import { CustomUrl } from './BoardLink/CustomUrl'
import { OpenBoard } from './BoardLink/OpenBoard'
import { EditBoardTitle } from './EditTitle/EditTitle'
import { RefreshBoard } from './RefreshBoard/RefreshBoard'

export function BoardHeader({ board }: { board: BoardDB }) {
    const boardLink = getBoardLinkClient(board.customUrl ?? board.id)

    return (
        <>
            <div className="flex flex-wrap items-center gap-4 w-full justify-start">
                <Heading1 as="h1" margin="none">
                    {board.meta.title}
                </Heading1>
                <EditBoardTitle board={board} />
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex min-w-0 items-end gap-2">
                    <div className="flex flex-col min-w-0 flex-1 justify-start">
                        <Paragraph margin="none" color="subdued">
                            Lenke til tavla:
                        </Paragraph>
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
        </>
    )
}
