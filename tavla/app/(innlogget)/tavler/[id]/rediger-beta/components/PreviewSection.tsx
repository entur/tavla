'use client'
import { SegmentedControl } from '@entur/form'
import { useState } from 'react'
import { Preview } from './Preview'

function PreviewSection({
    boardLink,
    breadcrumbs,
}: {
    boardLink: string
    breadcrumbs: React.ReactNode
}) {
    const [viewMode, setViewMode] = useState<string | null>('Liggende')

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                {breadcrumbs}
                <SegmentedControl value={viewMode} onChange={setViewMode}>
                    <SegmentedControl.Item value="Liggende">
                        Liggende
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="Stående">
                        Stående
                    </SegmentedControl.Item>
                </SegmentedControl>
            </div>
            <section className="flex flex-col justify-center p-4 bg-secondary rounded h-[70vh]">
                <Preview boardLink={boardLink} viewMode={viewMode} />
            </section>
        </div>
    )
}

export { PreviewSection }
