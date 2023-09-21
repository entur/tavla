import { TBoard } from 'types/settings'

export type TSort = 'alphabetical' | 'reverse-alphabetical'

export type TBoardsColumn = 'name' | 'url' | 'actions' | 'modified'

export type TBoards = {
    search: string
    sort: TSort
    columns: TBoardsColumn[]
    boards: TBoard[]
}
