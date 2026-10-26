import { z } from 'zod'

export const INFO_MESSAGE_MAX_LENGTH = 250

export const infoMessageSchema = z
    .string()
    .trim()
    .max(
        INFO_MESSAGE_MAX_LENGTH,
        `Infomeldingen kan være maks ${INFO_MESSAGE_MAX_LENGTH} tegn`,
    )
