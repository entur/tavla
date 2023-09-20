import { TBoard } from 'types/settings'

export type Action = { type: 'setSearch'; search: string }

export type TBoards = {
    search: string
    boards: TBoard[]
}

export function settingsReducer(board: TBoards, action: Action): TBoards {
    switch (action.type) {
        case 'setSearch':
            return { ...board, search: action.search }
    }
}
