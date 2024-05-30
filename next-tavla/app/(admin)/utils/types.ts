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

export const SortableDataKeys = {
    name: 'board.meta.title',
    lastModified: 'board.meta.dateModified',
    organization: 'organization.name',
}

export type SortableColumns = keyof typeof SortableDataKeys

export type TBoardsColumn = keyof typeof BoardsColumns

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
