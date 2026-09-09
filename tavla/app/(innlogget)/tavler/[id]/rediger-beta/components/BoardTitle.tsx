import { Heading1 } from 'node_modules/@entur/typography'
import type { BoardDB } from 'types/db-types/boards'
import { EditBoardTitle } from './EditTitle/EditTitle'

export function BoardTitle({ board }: { board: BoardDB }) {
    return (
        <div className="flex flex-wrap items-center gap-4 w-full justify-start pl-6">
            <Heading1 as="h1" margin="none">
                {board.meta.title}
            </Heading1>
            <EditBoardTitle board={board} />
        </div>
    )
}
