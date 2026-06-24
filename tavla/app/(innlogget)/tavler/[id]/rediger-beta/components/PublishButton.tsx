'use client'
import { useToast } from '@entur/alert'
import { SecondaryButton } from '@entur/button'
import { refreshBoard } from 'app/(innlogget)/tavler/[id]/rediger/components/RefreshButton/actions'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useTransition } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'

function PublishButton({ board }: { board: BoardDB }) {
    const { addToast } = useToast()
    const { capture } = usePosthogTracking()
    const [isPending, startTransition] = useTransition()

    const publish = () => {
        startTransition(async () => {
            capture('board_published', { location: 'board_page' })
            const status = await refreshBoard(board)
            if (status)
                addToast({
                    variant: 'success',
                    title: 'Tavle oppdatert',
                    content:
                        'Alle instanser av denne tavlen har blitt oppdatert!',
                })
            else
                addToast({
                    variant: 'info',
                    title: 'Feil ved oppdatering av tavlen',
                    content:
                        'Det oppsto en feil. Tavlen har ikke blitt oppdatert.',
                })
        })
    }

    return (
        <SecondaryButton
            onClick={publish}
            loading={isPending}
            aria-label={`Publiser tavle ${board.meta.title}`}
        >
            Publiser
        </SecondaryButton>
    )
}

export { PublishButton }
