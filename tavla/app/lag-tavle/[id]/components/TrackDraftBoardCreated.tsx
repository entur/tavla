'use client'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function TrackDraftBoardCreated() {
    const { capture } = usePosthogTracking()
    const pathname = usePathname()
    const isNew = useSearchParams().get('new') === 'true'

    useEffect(() => {
        if (!isNew) return
        capture('draft_board_created', { location: 'edit_board_page' })
        // Fjerner ?new=true fra URL-en slik at en senere reload av samme
        // lenke ikke teller som en ny opprettelse.
        window.history.replaceState(null, '', pathname)
    }, [isNew, capture, pathname])

    return null
}
