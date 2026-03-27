'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { BoardDB } from 'src/types/db-types/boards'
import { refreshBoard } from './actions'

function RefreshButton({ board }: { board: BoardDB }) {
    const toast = useToast()
    const posthog = usePosthogTracking()
    const refresh = async () => {
        posthog.capture('board_published', {
            location: 'board_page',
        })
        const status = await refreshBoard(board)
        if (status)
            toast.addToast({
                variant: 'success',
                title: 'Tavle oppdatert',
                content: 'Alle instanser av denne tavlen har blitt oppdatert!',
            })
        else
            toast.addToast({
                variant: 'info',
                title: 'Feil ved oppdatering av tavlen',
                content: 'Det oppsto en feil. Tavlen har ikke blitt oppdatert.',
            })
    }
    return (
        <Button variant="success" onClick={refresh} className="flex flex-row">
            Publiser tavle
        </Button>
    )
}

export { RefreshButton }
