import { TBoard } from 'types/settings'
import { useEffect, useRef, useState } from 'react'
import { formatTimestamp } from 'Admin/utils/time'

function AutoSave({ board }: { board: TBoard }) {
    const [status, setStatus] = useState(
        `Sist lagret: ${formatTimestamp(board.meta?.dateModified, true)}`,
    )
    const prevBoardRef = useRef<TBoard | null>(null)

    const setBoard = (board: TBoard) =>
        fetch('/api/board', {
            method: 'PUT',
            body: JSON.stringify({ board }),
        })

    useEffect(() => {
        if (
            prevBoardRef.current !== null &&
            JSON.stringify(prevBoardRef.current) !== JSON.stringify(board)
        ) {
            setBoard(board)
            setStatus(`Sist lagret: ${formatTimestamp(Date.now(), true)}`)
        }
        prevBoardRef.current = board
    }, [board])

    return <div>{status}</div>
}

export { AutoSave }
