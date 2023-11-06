import { TBoard } from 'types/settings'
import { TTile } from 'types/tile'

export async function createBoardRequest(tiles: TTile[], name: string) {
    const board = {
        tiles,
        meta: {
            title: name,
        },
    } as TBoard

    const response = await fetch('/api/board', {
        method: 'POST',
        body: JSON.stringify(board),
    })

    return response.json()
}
