import { TBoards, TBoardsColumn, TSort } from 'Admin/types/boards'

export type Action =
    | { type: 'setSearch'; search: string }
    | { type: 'setSort'; sort: { type: TSort; column: TBoardsColumn } }
    | { type: 'deleteBoard'; bid: string }

export function settingsReducer(board: TBoards, action: Action): TBoards {
    switch (action.type) {
        case 'setSearch':
            return { ...board, search: action.search }
        case 'setSort':
            return { ...board, sort: action.sort }
        case 'deleteBoard':
            return {
                ...board,
                boards: board.boards.filter((b) => b.id !== action.bid),
            }
    }
}
