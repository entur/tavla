'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { RefreshIcon } from 'node_modules/@entur/icons/dist'
import type { BoardDB } from 'src/types/db-types/boards'
import { refreshBoard } from './actions'

function RefreshBoard({ board }: { board: BoardDB }) {
    const toast = useToast()
    const { capture } = usePosthogTracking()

    const publish = async () => {
        capture('board_published', {
            location: 'edit_board_page',
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
        <Button
            variant="secondary"
            onClick={publish}
            className="flex flex-row gap-2 w-full sm:w-auto"
        >
            Oppdater tavle
            <RefreshIcon className="!top-[-2px]" />{' '}
            {/*  Høre med hanna om vi skal ha ikon her */}
        </Button>
    )
}

export { RefreshBoard }
