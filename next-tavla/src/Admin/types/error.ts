export type TTavlaError = 'AUTHORIZATION' | 'BOARD' | 'NOT_FOUND'

export class TavlaError extends Error {
    code: TTavlaError
    message: string
    constructor({ code, message }: { code: TTavlaError; message: string }) {
        super()
        this.code = code
        this.message = message
    }
}
