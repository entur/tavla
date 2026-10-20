import { LOCATIONS } from 'app/posthog/events'
import type { BoardDB } from 'src/types/db-types/boards'
import { BoardLinkActions } from './BoardLinkActions'
import { BoardTitle } from './BoardTitle'
import { EditBoardSidebar } from './EditBoardSidebar'
import { PreviewSection } from './PreviewSection'
import { PublishDraftBoard } from './PublishDraftBoard/PublishDraftBoard'

export function EditBoardBeta({
    board,
    boardLink,
    breadcrumbs,
}: {
    board: BoardDB
    boardLink: string
    breadcrumbs: React.ReactNode
}) {
    // Denne komponenten og barna dens gjenbrukes uendret for anonym
    // redigering på lag-tavle. isDraft er bare sann der, så den avgjør hvilken
    // location PostHog-eventene skal merkes med.
    const trackingLocation = board.isDraft
        ? LOCATIONS.EditBoardWithoutUser
        : LOCATIONS.EditBoardPage

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
                        trackingLocation={trackingLocation}
                    />
                </section>

                <aside className="w-full shrink-0 lg:w-[536px]">
                    <BoardTitle
                        board={board}
                        trackingLocation={trackingLocation}
                    />
                    <EditBoardSidebar
                        board={board}
                        trackingLocation={trackingLocation}
                    />
                </aside>
            </div>

            {board.isDraft ? (
                <PublishDraftBoard board={board} />
            ) : (
                <BoardLinkActions board={board} />
            )}
        </div>
    )
}
