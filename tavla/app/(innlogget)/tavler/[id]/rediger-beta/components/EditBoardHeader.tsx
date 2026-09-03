'use client'
import { Heading1, Paragraph } from '@entur/typography'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'
import { CopyBoardLink } from './BoardLink/CopyBoardLink'
import { CustomUrl } from './BoardLink/CustomUrl'
import { OpenBoard } from './BoardLink/OpenBoard'
import { EditBoardTitle } from './EditTitle/EditTitle'
import { RefreshBoard } from './RefreshBoard/RefreshBoard'

export function BoardHeader({ board }: { board: BoardDB }) {
    const boardLink = getBoardLinkClient(board.customUrl ?? board.id)

    return (
        <>
            <div className="flex flex-wrap items-center gap-2. w-full justify-between">
                <Heading1 as="h1" margin="none">
                    {/* {board.isArrivals ? 'Ankomsttavle: ' : 'Avgangstavle: '} */}
                    {board.meta.title}
                </Heading1>
                <EditBoardTitle board={board} />
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Paragraph margin="none" color="subdued">
                        Lenke til tavla
                    </Paragraph>
                    <Paragraph
                        margin="none"
                        className="min-w-0 flex-1 truncate rounded border bg-tintLight px-2 py-1"
                    >
                        {boardLink}
                    </Paragraph>
                    <div className="flex shrink-0 items-center gap-1">
                        <CustomUrl bid={board.id} customUrl={board.customUrl} />
                        <CopyBoardLink board={board} />
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                    <OpenBoard board={board} />
                    <RefreshBoard board={board} />
                </div>
            </div>
        </>
    )
}
