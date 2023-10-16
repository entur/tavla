import { TBoard } from 'types/settings'
import { useEffect, useState } from 'react'
import { formatTimestamp } from 'Admin/utils/time'

function AutoSave({ board }: { board: TBoard }) {
    const [status, setStatus] = useState('')

    const setBoard = (board: TBoard) =>
        fetch('/api/board', {
            method: 'PUT',
            body: JSON.stringify({ board }),
        })

    useEffect(() => {
        setBoard(board)
        setStatus(`Sist lagret: ${formatTimestamp(Date.now(), true)}`)
    }, [board])

    return <div>{status}</div>
}

export { AutoSave }
