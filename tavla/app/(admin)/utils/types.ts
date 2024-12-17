export type TSort = 'none' | 'ascending' | 'descending'

export const BoardsColumns = {
    name: 'Navn',
    tags: 'Merkelapper',
    lastModified: 'Sist oppdatert',
    organization: 'Organisasjon',
    actions: 'Handlinger',
} as const

export const DEFAULT_BOARD_COLUMNS = Object.keys(
    BoardsColumns,
) as TBoardsColumn[]

export type TBoardsColumn = keyof typeof BoardsColumns

export const SortableColumns = ['name', 'organization', 'lastModified'] as const
