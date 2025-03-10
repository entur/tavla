export type TSort = 'none' | 'ascending' | 'descending'

export const TableColumns = {
    name: 'Navn',
    tags: 'Merkelapper',
    lastModified: 'Sist oppdatert',
    actions: 'Handlinger',
} as const

export const DEFAULT_BOARD_COLUMNS = Object.keys(TableColumns) as TTableColumn[]

export const SortableColumns = ['name', 'lastModified'] as const

export type TTableColumn = keyof typeof TableColumns
