import type { BoardDB } from 'src/types/db-types/boards'
import { BoardLinkActions } from './BoardLinkActions'
import { BoardTitle } from './BoardTitle'
import { EditBoardSidebar } from './EditBoardSidebar'
import { PreviewSection } from './PreviewSection'

export function EditBoardBeta({
    board,
    boardLink,
    breadcrumbs,
}: {
    board: BoardDB
    boardLink: string
    breadcrumbs: React.ReactNode
}) {
    return (
        <div
            data-transport-palette={board.transportPalette}
            className="flex flex-col gap-12"
        >
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
                <section className="flex min-w-0 flex-1 flex-col gap-12 lg:sticky lg:top-12 lg:self-start">
                    <PreviewSection
                        boardLink={boardLink}
                        breadcrumbs={breadcrumbs}
                    />
                </section>

                <aside className="w-full shrink-0 lg:w-[536px]">
                    <BoardTitle board={board} />
                    <EditBoardSidebar board={board} />
                </aside>
            </div>

            <BoardLinkActions board={board} />
        </div>
    )
}
