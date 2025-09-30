import { TFolder } from 'types/settings'

export type TSort = 'none' | 'ascending' | 'descending'

export const TableColumns = {
    name: 'Navn',
    lastModified: 'Sist oppdatert',
    actions: 'Handlinger',
} as const

export const DEFAULT_BOARD_COLUMNS = Object.keys(TableColumns) as TTableColumn[]

export const SortableColumns = ['name', 'lastModified'] as const

export type TTableColumn = keyof typeof TableColumns

/**
 * Represents a folder with additional metadata.
 *
 * Extends the `TFolder` type by including the number of boards contained in the folder
 * and the timestamp of the last update.
 *
 * @property {number} boardCount - The number of boards in the folder.
 * @property {number} [lastUpdated] - The timestamp (in milliseconds since epoch) when the folder was last updated. Optional.
 */
export type Folder = TFolder & {
    boardCount: number
    lastUpdated?: number
}
