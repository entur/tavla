import { BoardsSettings, TBoardsColumn, TSort } from 'Admin/types/boards'
import { xor } from 'lodash'
import { TBoard } from 'types/settings'

export type Action =
    | { type: 'setSearch'; search: string }
    | { type: 'toggleFilterTag'; tag: string }
    | { type: 'setSort'; sort: { type: TSort; column: TBoardsColumn } }
    | { type: 'deleteBoard'; bid: string }
    | { type: 'toggleColumn'; column: TBoardsColumn }
    | { type: 'setColumns'; columns: TBoardsColumn[] }
    | { type: 'setBoard'; board: TBoard }
    | { type: 'setSettings'; payload: BoardsSettings }

export function settingsReducer(
    boardsSettings: BoardsSettings,
    action: Action,
): BoardsSettings {
    switch (action.type) {
        case 'setSearch':
            return { ...boardsSettings, search: action.search }
        case 'toggleFilterTag':
            return {
                ...boardsSettings,
                filterTags: xor(boardsSettings.filterTags, [action.tag]),
            }
        case 'setSort':
            return { ...boardsSettings, sort: action.sort }
        case 'deleteBoard':
            return {
                ...boardsSettings,
                boards: boardsSettings.boards.filter(
                    (b) => b.id !== action.bid,
                ),
            }
        case 'toggleColumn':
            return {
                ...boardsSettings,
                columns: xor(boardsSettings.columns, [action.column]),
            }
        case 'setColumns':
            return {
                ...boardsSettings,
                columns: action.columns,
            }
        case 'setBoard':
            return {
                ...boardsSettings,
                boards: boardsSettings.boards.map((board) => {
                    if (board.id !== action.board.id) return board
                    return action.board
                }),
            }
        case 'setSettings':
            return action.payload
    }
}
