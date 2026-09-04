'use client'
import { Heading3, Paragraph } from '@entur/typography'
import type { BoardDB } from 'types/db-types/boards'
import { AddStopPlaceTile } from './AddStopPlace/AddStopPlaceTile'
import { TileList } from './AddStopPlace/TileList'

export function EditBoardSidebar({ board }: { board: BoardDB }) {
    return (
        <div className="flex h-full flex-col gap-12 overflow-y-auto text-sm">
            <EditSection title="Hva vil du vise på Tavla?">
                <AddStopPlaceTile
                    trackingLocation="board_page"
                    board={board}
                ></AddStopPlaceTile>
                <TileList board={board} />
            </EditSection>

            <EditSection title="Hvordan vil du at Tavla skal se ut?">
                <Paragraph>Kommer senere...</Paragraph>
            </EditSection>

            <EditSection title="Hva vil du vise på tavla?">
                <Paragraph>Kommer senere...</Paragraph>
            </EditSection>
        </div>
    )
}

function EditSection({
    children,
    title,
}: {
    children: React.ReactNode
    title: string
}) {
    return (
        <section className="flex flex-col gap-4 bg-tintLight p-6 rounded-xl">
            <Heading3 margin="none">{title}</Heading3>
            {children}
        </section>
    )
}
