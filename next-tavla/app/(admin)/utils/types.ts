export type TSort = 'none' | 'ascending' | 'descending'

export const BoardsColumns = {
    name: 'Navn',
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

export type TTavlaError =
    | 'AUTHORIZATION'
    | 'BOARD'
    | 'NOT_FOUND'
    | 'ORGANIZATION'

export class TavlaError extends Error {
    code: TTavlaError
    message: string
    constructor({ code, message }: { code: TTavlaError; message: string }) {
        super()
        this.code = code
        this.message = message
    }
}
