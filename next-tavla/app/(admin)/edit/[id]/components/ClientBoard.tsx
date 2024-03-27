'use client'
import { Board } from 'Board/scenarios/Board'
import { TBoard } from 'types/settings'

function ClientBoard({ board }: { board: TBoard }) {
    return <Board board={board} />
}
export { ClientBoard }
