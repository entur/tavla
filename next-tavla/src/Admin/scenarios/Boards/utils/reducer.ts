import { TBoards, TBoardsColumn, TSort } from 'Admin/types/boards'
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
        case 'setColumns':
            return {
                ...board,
                columns: action.columns,
            }
        case 'addTag':
            return {
                ...board,
                boards: board.boards.map((board) => {
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
                ...board,
                boards: board.boards.map((board) => {
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
