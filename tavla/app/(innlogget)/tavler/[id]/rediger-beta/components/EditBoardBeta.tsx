'use client'
import { Preview } from 'app/(innlogget)/tavler/[id]/rediger/components/Preview'
import type { BoardDB } from 'src/types/db-types/boards'
import { BoardHeader } from './EditBoardHeader'
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
            className="flex flex-col gap-6 lg:flex-row lg:items-start"
        >
            <section className="flex min-w-0 flex-1 flex-col gap-4">
                <BoardHeader board={board} />

                <div data-theme={board.theme ?? 'dark'}>
                    <Preview boardLink={boardLink} />
                </div>
            </section>

            <aside className="w-full shrink-0 lg:w-[536px]">
                <EditBoardSidebar />
            </aside>
        </div>
    )
}
