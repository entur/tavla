'use client'
import { Button } from '@entur/button'
import { TBoard } from 'types/settings'
import { refreshBoard } from './actions'
import { useToast } from '@entur/alert'
import { AgreesIcon } from '@entur/icons'
import { usePostHog } from 'posthog-js/react'

function RefreshButton({ board }: { board: TBoard }) {
    const toast = useToast()
    const posthog = usePostHog()
    const refresh = async () => {
        posthog.capture('PUBLISH_BOARD_BTN')
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
        <Button variant="secondary" onClick={refresh} className="flex flex-row">
            Publiser tavle
            <AgreesIcon inline />
        </Button>
    )
}

export { RefreshButton }
