import { z } from 'zod'

// TODO - finn en passe lengde
export const INFO_MESSAGE_MAX_LENGTH = 500

export const infoMessageSchema = z
    .string()
    .trim()
    .max(
        INFO_MESSAGE_MAX_LENGTH,
        `Infomeldingen kan være maks ${INFO_MESSAGE_MAX_LENGTH} tegn`,
    )
