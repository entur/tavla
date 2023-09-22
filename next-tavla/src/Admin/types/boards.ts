import { TBoard } from 'types/settings'

export type TSort = 'none' | 'ascending' | 'descending'

export type TBoardsColumn = 'name' | 'url' | 'actions' | 'lastModified'

export const SortableColumns = ['name', 'lastModified'] as const

export type TBoards = {
    search: string
    sort: { type: TSort; column: TBoardsColumn }
    columns: TBoardsColumn[]
    boards: TBoard[]
}
