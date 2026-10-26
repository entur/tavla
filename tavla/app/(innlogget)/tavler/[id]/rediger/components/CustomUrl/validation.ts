import { z } from 'zod'

const VALID_CHARS = /^[a-zA-Z0-9_-]+$/
const RESERVED_SLUGS = new Set(['preview', 'stop'])

export const customUrlSchema = z
    .string()
    .trim()
    .refine((value) => value === '' || VALID_CHARS.test(value), {
        message:
            'Du kan kun bruke bokstaver (ikke æ, ø og å), tall, bindestrek og understrek.',
    })
    .refine((value) => !RESERVED_SLUGS.has(value.toLowerCase()), {
        message: 'Denne lenken kan ikke brukes.',
    })

/**
 * Benyttes for validering i client
 */
export function validateCustomUrl(value: string): string | undefined {
    const result = customUrlSchema.safeParse(value)
    return result.success ? undefined : result.error.issues[0]?.message
}
