'use client'
import { Heading4 } from '@entur/typography'
import type { BoardDB } from 'types/db-types/boards'
import { AddStopPlaceTile } from './AddStopPlace/AddStopPlaceTile'
import { EditViewType } from './EditViewType/EditViewType'
import { InfoMessageForm } from './InfoMessage/InfoMessage'
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
                <InfoMessageForm bid={board.id} infoMessage={board.footer} />
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
        <section className="flex flex-col gap-4 p-6 rounded-xl">
            <Heading4 margin="none" as="h2">
                {title}
            </Heading4>
            {children}
        </section>
    )
}
