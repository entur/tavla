export type TSort = 'none' | 'ascending' | 'descending'

export const BoardsAndFoldersColumns = {
    name: 'Navn',
    numOfBoards: 'Antall tavler',
    lastModified: 'Sist oppdatert',
    actions: 'Handlinger',
} as const

export const DEFAULT_BOARD_COLUMNS = Object.keys(
    BoardsAndFoldersColumns,
) as TTableColumn[]

export const SortableColumns = ['name', 'numOfBoards', 'lastModified'] as const

export const BoardsInFoldersColumns = {
    name: 'Tavler',
    lastModified: 'Sist oppdatert',
    actions: 'Handlinger',
} as const

export const DEFAULT_BOARD_IN_FOLDER_COLUMNS = Object.keys(
    BoardsInFoldersColumns,
) as TTableColumn[]

export type TTableColumn = keyof typeof BoardsAndFoldersColumns
