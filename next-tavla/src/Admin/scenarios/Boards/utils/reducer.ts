import { TBoards } from 'Admin/types/boards'

export type Action = { type: 'setSearch'; search: string }

export function settingsReducer(board: TBoards, action: Action): TBoards {
    switch (action.type) {
        case 'setSearch':
            return { ...board, search: action.search }
    }
}
