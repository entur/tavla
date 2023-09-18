import { TBoard, TBoardID } from 'types/settings'

export type Action = { type: 'deleteBoard'; boardId: TBoardID }

export function boardsReducer(boards: TBoard[], action: Action): TBoard[] {
    switch (action.type) {
        case 'deleteBoard':
            return boards.filter(({ id }) => id !== action.boardId)
        default:
            return boards
    }
}
