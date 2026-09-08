'use client'
import { Heading4, Paragraph } from '@entur/typography'
import type { BoardDB } from 'src/types/db-types/boards'
import { InfoMessageForm } from './InfoMessage/InfoMessage'
import { WalkingDistanceForm } from './WalkingDistance/WalkingDistance'

export function EditBoardSidebar({ board }: { board: BoardDB }) {
    return (
        <div className="flex h-full flex-col gap-12 text-sm">
            <EditSection title="Hvilke stoppesteder vil du vise på Tavla?">
                <Paragraph>Kommer senere...</Paragraph>
            </EditSection>

            <EditSection title="Hvordan vil du at Tavla skal se ut?">
                <Paragraph>Kommer senere...</Paragraph>
            </EditSection>

            <EditSection title="Hva vil du vise på tavla?">
                <InfoMessageForm bid={board.id} infoMessage={board.footer} />
                <WalkingDistanceForm
                    bid={board.id}
                    location={board.meta.location}
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
