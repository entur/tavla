'use client'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function TrackDraftBoardCreated({ isNew }: { isNew: boolean }) {
    const { capture } = usePosthogTracking()
    const pathname = usePathname()

    useEffect(() => {
        if (!isNew) return
        capture('draft_board_created', { location: 'edit_board_page' })
        // Fjerner ?new=true fra URL-en slik at en senere reload av samme
        // lenke ikke teller som en ny opprettelse.
        window.history.replaceState(null, '', pathname)
    }, [isNew, capture, pathname])

    return null
}
