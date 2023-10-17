import { TBoard } from 'types/settings'
import { useEffect, useState } from 'react'
import { formatTimestamp } from 'Admin/utils/time'

function AutoSave({ board }: { board: TBoard }) {
    const [status, setStatus] = useState(
        `Sist lagret: ${formatTimestamp(board.meta?.dateModified, true)}`,
    )
    const [initialLoad, setInitialLoad] = useState(true)

    const setBoard = (board: TBoard) =>
        fetch('/api/board', {
            method: 'PUT',
            body: JSON.stringify({ board }),
        })

    useEffect(() => {
        if (initialLoad) return () => setInitialLoad(false)
        setBoard(board)
        setStatus(`Sist lagret: ${formatTimestamp(Date.now(), true)}`)
    }, [initialLoad, board])

    return <div>{status}</div>
}

export { AutoSave }
