'use client'
import { SegmentedControl } from '@entur/form'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import { Preview } from './Preview'

function PreviewSection({
    boardLink,
    breadcrumbs,
}: {
    boardLink: string
    breadcrumbs: React.ReactNode
}) {
    const [viewMode, setViewMode] = useState<'Liggende' | 'Stående'>('Liggende')
    const { capture } = usePosthogTracking()

    return (
        <div className="flex flex-col gap-4">
            <div
                className={`flex items-center ${breadcrumbs ? 'justify-between' : 'justify-end'}`}
            >
                {breadcrumbs}
                <SegmentedControl
                    value={viewMode}
                    onChange={(value) => {
                        const mode = value as 'Liggende' | 'Stående'
                        capture('view_mode_changed', {
                            location: 'edit_board_page',
                            value: mode,
                        })
                        setViewMode(mode)
                    }}
                >
                    <SegmentedControl.Item value="Liggende">
                        Liggende
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="Stående">
                        Stående
                    </SegmentedControl.Item>
                </SegmentedControl>
            </div>
            <section className="flex flex-col items-center justify-center p-2 bg-secondary rounded h-[70vh] min-w-0">
                <Preview boardLink={boardLink} viewMode={viewMode} />
            </section>
        </div>
    )
}

export { PreviewSection }
