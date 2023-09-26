import { TBoards, TBoardsColumn, TSort } from 'Admin/types/boards'
import { xor } from 'lodash'

export type Action =
    | { type: 'setSearch'; search: string }
    | { type: 'setSort'; sort: { type: TSort; column: TBoardsColumn } }
    | { type: 'deleteBoard'; bid: string }
    | { type: 'toggleColumn'; column: TBoardsColumn }
    | { type: 'setColumnOrder'; columnOrder: TBoardsColumn[] }

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
        case 'toggleColumn':
            return {
                ...board,
                columns: xor(board.columns, [action.column]),
            }
        case 'setColumnOrder':
            return {
                ...board,
                columnOrder: action.columnOrder,
            }
    }
}
