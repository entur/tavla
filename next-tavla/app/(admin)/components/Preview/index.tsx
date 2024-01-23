'use client'
import { TBoard } from 'types/settings'
import { Board } from 'Board/scenarios/Board'

function Preview({ board }: { board: TBoard }) {
    return (
        <div>
            <Board board={board} />
        </div>
    )
}

export { Preview }
