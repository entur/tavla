import { useToast } from '@entur/alert'
import { useCallback, useEffect, useState } from 'react'
import { TBoard } from 'types/settings'

function useAutoSaveSettings(board: TBoard) {
    const { addToast } = useToast()
    const [prevTilesLength, setPrevTilesLength] = useState(board.tiles.length)

    const setBoard = (board: TBoard) =>
        fetch('/api/board', {
            method: 'PUT',
            body: JSON.stringify({ board }),
        })

    const saveSettings = useCallback(() => {
        addToast({
            title: 'Lagret!',
            content: 'Innstillingene er lagret',
            variant: 'info',
        })
        setBoard(board)
    }, [addToast, board])

    useEffect(() => {
        if (board.tiles.length === prevTilesLength) {
            return
        }
        saveSettings()
        setPrevTilesLength(board.tiles.length)
    }, [board.tiles.length, prevTilesLength, saveSettings])

    return saveSettings
}

export { useAutoSaveSettings }
