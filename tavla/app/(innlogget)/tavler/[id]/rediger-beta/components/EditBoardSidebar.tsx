'use client'
import { Heading3, Paragraph } from '@entur/typography'
import type { BoardDB } from 'types/db-types/boards'
import { AddStopPlaceTile } from './AddStopPlace/AddStopPlaceTile'
import { EditViewType } from './EditViewType/EditViewType'
import { TileList } from './TileList/TileList'

export function EditBoardSidebar({ board }: { board: BoardDB }) {
    return (
        <div className="flex flex-col gap-8 overflow-y-auto text-sm">
            <EditSection title="Hva vil du vise på Tavla?">
                <AddStopPlaceTile board={board} />
                <TileList board={board} />
            </EditSection>

            <EditSection title="Hvordan vil du at Tavla skal se ut?">
                <EditViewType
                    bid={board.id}
                    hasCombinedTiles={board.isCombinedTiles}
                />
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
