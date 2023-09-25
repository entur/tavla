import { BoardsSettings, TBoardsColumn, TSort } from 'Admin/types/boards'
import { xor } from 'lodash'
import { TTag } from 'types/meta'
import { TBoardID } from 'types/settings'

export type Action =
    | { type: 'setSearch'; search: string }
    | { type: 'setSort'; sort: { type: TSort; column: TBoardsColumn } }
    | { type: 'deleteBoard'; bid: string }
    | { type: 'toggleColumn'; column: TBoardsColumn }
    | { type: 'setColumns'; columns: TBoardsColumn[] }
    | { type: 'addTag'; boardId: TBoardID; tag: TTag }
    | { type: 'removeTag'; boardId: TBoardID; tag: TTag }

export function settingsReducer(
    boardsSettings: BoardsSettings,
    action: Action,
): BoardsSettings {
    switch (action.type) {
        case 'setSearch':
            return { ...boardsSettings, search: action.search }
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
        case 'addTag':
            return {
                ...boardsSettings,
                boards: boardsSettings.boards.map((board) => {
                    if (board.id !== action.boardId) return board
                    return {
                        ...board,
                        meta: {
                            ...board.meta,
                            tags: [...(board.meta?.tags ?? []), action.tag],
                        },
                    }
                }),
            }
        case 'removeTag':
            return {
                ...boardsSettings,
                boards: boardsSettings.boards.map((board) => {
                    if (board.id !== action.boardId) return board
                    return {
                        ...board,
                        meta: {
                            ...board.meta,
                            tags: (board.meta?.tags ?? []).filter(
                                (tag) => tag !== action.tag,
                            ),
                        },
                    }
                }),
            }
    }
}
