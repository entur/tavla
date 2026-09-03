const RESERVED_SLUGS = /^(preview|stop)$/i
const VALID_CHARS = /^[a-zA-Z0-9_-]+$/

export function validateCustomUrl(value: string): string | undefined {
    if (!value) return undefined
    if (!VALID_CHARS.test(value)) {
        return 'Du kan kun bruke bokstaver (ikke æ, ø og å), tall, bindestrek og understrek.'
    }
    if (RESERVED_SLUGS.test(value)) {
        return 'Denne lenken kan ikke brukes.'
    }
    return undefined
}
