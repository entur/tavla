import { TBoard } from 'types/settings'

export type Action = { type: 'setSearch'; search: string }

export type TSort = 'alphabetical' | 'reverse-alphabetical'
export type TBoardsColumn = 'name' | 'url' | 'actions' | 'modified'

export type TBoards = {
    search: string
    sort: TSort
    columns: TBoardsColumn[]
    boards: TBoard[]
}

export function settingsReducer(board: TBoards, action: Action): TBoards {
    switch (action.type) {
        case 'setSearch':
            return { ...board, search: action.search }
    }
}
