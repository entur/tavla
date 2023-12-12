export type TSort = 'none' | 'ascending' | 'descending'

export const BoardsColumns = {
    name: 'Tavlenavn',
    url: 'Lenke',
    tags: 'Merkelapper',
    lastModified: 'Sist oppdatert',
    actions: 'Handlinger',
} as const

export const DEFAULT_BOARD_COLUMNS = Object.keys(
    BoardsColumns,
) as TBoardsColumn[]

export type TBoardsColumn = keyof typeof BoardsColumns

export const SortableColumns = ['name', 'lastModified'] as const
