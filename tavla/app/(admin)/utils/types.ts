export type TSort = 'none' | 'ascending' | 'descending'

export const BoardsColumns = {
    name: 'Navn',
    numOfBoards: 'Antall tavler',
    lastModified: 'Sist oppdatert',
    actions: 'Handlinger',
} as const

export const DEFAULT_BOARD_COLUMNS = Object.keys(
    BoardsColumns,
) as TBoardsColumn[]

export type TBoardsColumn = keyof typeof BoardsColumns

export const SortableColumns = ['name', 'numOfBoards', 'lastModified'] as const
