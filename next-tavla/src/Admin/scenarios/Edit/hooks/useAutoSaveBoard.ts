import { useEffect, useRef } from 'react'
import { TBoard } from 'types/settings'

function useAutoSaveBoard(board: TBoard) {
    const initialLoad = useRef(true)

    const setBoard = (board: TBoard) =>
        fetch('/api/board', {
            method: 'PUT',
            body: JSON.stringify({ board }),
        })

    useEffect(() => {
        if (initialLoad.current) {
            initialLoad.current = false
            return
        }
        setBoard(board)
    }, [initialLoad, board])
}
export { useAutoSaveBoard }
