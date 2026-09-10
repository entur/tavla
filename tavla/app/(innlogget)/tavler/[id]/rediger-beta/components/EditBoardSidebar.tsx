'use client'
import { Heading4 } from '@entur/typography'
import type { BoardDB } from 'types/db-types/boards'
import { AddStopPlaceTile } from './AddStopPlace/AddStopPlaceTile'
import { EditInfoMessage } from './EditInfoMessage/EditInfoMessage'
import { EditLanguage } from './EditLanguage/EditLanguage'
import { EditTheme } from './EditTheme/EditTheme'
import { EditViewType } from './EditViewType/EditViewType'
import { TileList } from './TileList/TileList'
import { WalkingDistanceForm } from './WalkingDistance/WalkingDistance'

export function EditBoardSidebar({ board }: { board: BoardDB }) {
    return (
        <div className="flex flex-col gap-8 text-sm">
            <EditSection title="Hva vil du vise på Tavla?">
                <AddStopPlaceTile board={board} />
                <TileList board={board} />
            </EditSection>

            <EditSection title="Hvordan vil du at Tavla skal se ut?">
                <EditViewType
                    bid={board.id}
                    hasCombinedTiles={board.isCombinedTiles}
                />
                <EditTheme bid={board.id} theme={board.theme ?? 'dark'} />
            </EditSection>

            <EditSection title="Hva vil du vise på tavla?">
                <EditInfoMessage bid={board.id} infoMessage={board.footer} />
                <WalkingDistanceForm
                    bid={board.id}
                    location={board.meta.location}
                />
                <EditLanguage
                    bid={board.id}
                    language={board.language ?? 'nb'}
                />
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
