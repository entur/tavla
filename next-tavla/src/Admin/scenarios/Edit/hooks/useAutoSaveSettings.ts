import { useToast } from '@entur/alert'
import { formatTimestamp } from 'Admin/utils/time'
import { useCallback, useEffect, useState } from 'react'
import { TBoard } from 'types/settings'

function useAutoSaveSettings(board: TBoard, auto: boolean) {
    const { addToast } = useToast()

    const [status, setStatus] = useState('')

    const setBoard = (board: TBoard) =>
        fetch('/api/board', {
            method: 'PUT',
            body: JSON.stringify({ board }),
        })

    const saveSettings = useCallback(() => {
        if (!auto)
            addToast({
                title: 'Lagret!',
                content: 'Innstillingene er lagret',
                variant: 'info',
            })
        setBoard(board)
        setStatus(`Sist lagret: ${formatTimestamp(Date.now(), true)}`)
    }, [addToast, board, auto])

    useEffect(() => {
        if (auto) saveSettings()
        else setStatus('Du har endringer som ikke er lagret')
    }, [board, saveSettings, auto])

    return { saveSettings, status }
}

export { useAutoSaveSettings }
