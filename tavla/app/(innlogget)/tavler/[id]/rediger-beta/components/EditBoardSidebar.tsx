'use client'
import { Heading4 } from '@entur/typography'
import type { BoardDB } from 'types/db-types/boards'
import { AddStopPlaceTile } from './AddStopPlace/AddStopPlaceTile'
import { EditElements } from './EditElements/EditElements'
import { EditFontSize } from './EditFontSize/EditFontSize'
import { EditInfoMessage } from './EditInfoMessage/EditInfoMessage'
import { EditLanguage } from './EditLanguage/EditLanguage'
import { EditTheme } from './EditTheme/EditTheme'
import { EditTransportPalette } from './EditTransportPalette/EditTransportPalette'
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
                <EditFontSize
                    bid={board.id}
                    fontSize={board.meta.fontSize ?? 'medium'}
                />
                <EditTransportPalette board={board} />
            </EditSection>

            <EditSection title="Hva vil du vise på tavla?">
                <EditInfoMessage bid={board.id} infoMessage={board.footer} />
                <WalkingDistanceForm
                    bid={board.id}
                    location={board.meta.location}
                />
                <EditElements
                    bid={board.id}
                    hideClock={board.hideClock ?? false}
                    hideLogo={board.hideLogo ?? false}
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
        <section className="flex flex-col gap-8 rounded-xl my-8">
            <Heading4 margin="none" as="h2">
                {title}
            </Heading4>
            {children}
        </section>
    )
}
