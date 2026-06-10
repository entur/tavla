'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useTransition } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { refreshBoard } from '../../rediger/components/RefreshButton/actions'

/**
 * The single honest write action (problem #6, grep F): changes are already
 * saved and reach the screen automatically within a short while — this button
 * only pushes them out *immediately* (useful during disruptions). It is an
 * accelerator, not the thing that makes the change real.
 */
function UpdateScreenNow({ board }: { board: BoardDB }) {
    const toast = useToast()
    const posthog = usePosthogTracking()
    const [isPending, startTransition] = useTransition()

    const update = () => {
        startTransition(async () => {
            posthog.capture('board_published', { location: 'board_page' })
            const ok = await refreshBoard(board)
            if (ok) {
                toast.addToast({
                    variant: 'success',
                    title: 'Skjermene er oppdatert',
                    content:
                        'Endringene vises nå på alle aktive skjermer som viser denne tavla.',
                })
            } else {
                toast.addToast({
                    variant: 'info',
                    title: 'Kunne ikke oppdatere umiddelbart',
                    content:
                        'Endringene er lagret og vil vises på skjermen automatisk om litt.',
                })
            }
        })
    }

    return (
        <Button variant="primary" loading={isPending} onClick={update}>
            Oppdater skjermen nå
        </Button>
    )
}

export { UpdateScreenNow }
