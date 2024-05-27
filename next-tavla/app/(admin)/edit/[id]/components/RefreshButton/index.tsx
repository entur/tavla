'use client'
import { Button } from '@entur/button'
import { TBoard } from 'types/settings'
import { refreshBoard } from './actions'
import { useToast } from '@entur/alert'
import { RefreshIcon } from '@entur/icons'

function RefreshButton({ board }: { board: TBoard }) {
    const toast = useToast()
    const refresh = async () => {
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
                title: 'Feil ved oppdatering av Tavle',
                content: 'Det oppsto en feil, tavlen har ikke blitt oppdatert',
            })
    }
    return (
        <Button variant="secondary" onClick={refresh} className="flex flex-row">
            Oppdater Tavle
            <RefreshIcon inline />
        </Button>
    )
}

export { RefreshButton }
