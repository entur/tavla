import { z } from 'zod'

export const NAME_MAX_LENGTH = 50
export const OFFSET_MAX_MINUTES = 60

export const displayNameSchema = z
    .string()
    .max(
        NAME_MAX_LENGTH,
        `Navnet kan ikke være lengre enn ${NAME_MAX_LENGTH} tegn`,
    )
    .optional()

export const offsetSchema = z
    .number()
    .max(
        OFFSET_MAX_MINUTES,
        `Du kan ikke forskyve avgangstid mer enn ${OFFSET_MAX_MINUTES} minutter`,
    )
    .optional()
