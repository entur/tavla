import { Preview } from 'app/(innlogget)/tavler/[id]/rediger-beta/components/Preview'
import type { BoardDB } from 'src/types/db-types/boards'
import { BoardLinkActions } from './BoardLinkActions'
import { BoardTitle } from './BoardTitle'
import { EditBoardSidebar } from './EditBoardSidebar'

export function EditBoardBeta({
    board,
    boardLink,
}: {
    board: BoardDB
    boardLink: string
}) {
    return (
        <div
            data-transport-palette={board.transportPalette}
            className="flex flex-col gap-8 lg:flex-row lg:items-start"
        >
            <section className="flex min-w-0 flex-1 flex-col gap-8 lg:sticky lg:top-[15vh] lg:self-start">
                <div data-theme={board.theme ?? 'dark'}>
                    <Preview boardLink={boardLink} />
                </div>
                <BoardLinkActions board={board} />
            </section>

            <aside className="w-full shrink-0 lg:w-[536px]">
                <BoardTitle board={board} />
                <EditBoardSidebar />
            </aside>
        </div>
    )
}
