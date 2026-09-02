'use client'
import { Heading1 } from '@entur/typography'
import type { BoardDB } from 'src/types/db-types/boards'
import { EditBoardTitle } from './EditTitle/EditTitle'

export function BoardHeader({ board }: { board: BoardDB }) {
    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                <Heading1 as="h1" margin="none">
                    {board.isArrivals ? 'Ankomsttavle: ' : 'Avgangstavle: '}
                    {board.meta.title}
                </Heading1>
                <EditBoardTitle board={board} />
            </div>

            <div className="flex items-center justify-between gap-4">
                {/* fylle inn CustomURL her */}
            </div>
        </>
    )
}
