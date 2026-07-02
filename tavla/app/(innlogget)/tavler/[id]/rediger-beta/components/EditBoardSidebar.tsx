'use client'
import { Badge } from '@entur/layout'
import { Heading2, Heading3, Paragraph } from '@entur/typography'
import { Open } from 'app/(innlogget)/tavler/[id]/rediger/components/Buttons/Open'
import type { BoardDB } from 'src/types/db-types/boards'

export function EditBoardSidebar({ board }: { board: BoardDB }) {
    return (
        <div className="flex h-full flex-col gap-12 overflow-y-auto text-sm">
            <section className="flex flex-col gap-4 bg-tintLight p-6 rounded-xl">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap justify-between gap-2">
                        <div>
                            <Badge variant="primary" size="small">
                                {board.isArrivals
                                    ? 'Ankomsttavle'
                                    : 'Avgangstavle'}
                            </Badge>
                            <Heading2 as="h1" margin="none">
                                {board.meta.title}
                            </Heading2>
                        </div>

                        <div className="flex gap-2">
                            <Open
                                type="button"
                                bid={
                                    board.customUrl ? board.customUrl : board.id
                                }
                                board={board}
                                trackingLocation="board_page"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <EditSection title="Hvilke stoppesteder vil du vise på Tavla?">
                <Paragraph>Kommer senere...</Paragraph>
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
