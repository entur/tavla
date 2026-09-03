'use client'
import { Heading3, Paragraph } from '@entur/typography'

export function EditBoardSidebar() {
    return (
        <div className="flex flex-col gap-12 overflow-y-auto text-sm">
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
