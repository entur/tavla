'use client'
import { Preview } from 'app/(innlogget)/tavler/[id]/rediger/components/Preview'
import type { BoardDB } from 'src/types/db-types/boards'
import { EditBoardSidebar } from './EditBoardSidebar'

export function EditBoardBeta({
    initialBoard,
    boardLink,
}: {
    initialBoard: BoardDB
    boardLink: string
}) {
    return (
        <div
            data-transport-palette={initialBoard.transportPalette}
            className="flex flex-col gap-6 lg:flex-row lg:items-start"
        >
            <section
                data-theme={initialBoard.theme ?? 'dark'}
                aria-label="Forhåndsvisning av Tavla"
                className="min-w-0 flex-1 lg:sticky lg:top-8 lg:self-start"
            >
                <Preview boardLink={boardLink} />
            </section>

            <aside className="w-full shrink-0 rounded-md lg:w-[536px]">
                <EditBoardSidebar board={initialBoard} />
            </aside>
        </div>
    )
}
