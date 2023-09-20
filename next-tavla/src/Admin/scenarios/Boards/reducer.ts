import { TBoard } from 'types/settings'

export type Action = { type: 'deleteBoard'; board: TBoard }

export function boardsReducer(boards: TBoard[], action: Action): TBoard[] {
    switch (action.type) {
        case 'deleteBoard':
            return boards.filter(({ id }) => id !== action.board.id)
        default:
            return boards
    }
}
