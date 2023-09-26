import { TBoard } from 'types/settings'

export type TSort = 'none' | 'ascending' | 'descending'

export const BoardsColumns = {
    name: 'Tavlenavn',
    url: 'Lenke',
    actions: 'Handlinger',
    lastModified: 'Sist oppdatert',
} as const

export type TBoardsColumn = keyof typeof BoardsColumns

export const SortableColumns = ['name', 'lastModified'] as const

export type TBoards = {
    search: string
    sort: { type: TSort; column: TBoardsColumn }
    columns: TBoardsColumn[]
    columnOrder: TBoardsColumn[]
    boards: TBoard[]
}
