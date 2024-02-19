'use client'

import { Board } from 'Board/scenarios/Board'
import { useEffect, useState } from 'react'
import { TBoard } from 'types/settings'

function Preview({ boards }: { boards: TBoard[] }) {
    const [boardIndex, setBoardIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setBoardIndex((boardIndex + 1) % boards.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [boardIndex, boards])

    const currentBoard = boards[boardIndex] ?? undefined
    if (!currentBoard) return null
    return <Board board={currentBoard} style={{ display: 'flex' }} />
}
export { Preview }
