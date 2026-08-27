import { z } from 'zod'

export const BOARD_TITLE_MAX_LENGTH = 50

export const boardTitleSchema = z
    .string()
    .trim()
    .min(1, 'Du har ikke gitt tavla et navn')
    .max(
        BOARD_TITLE_MAX_LENGTH,
        `Navnet kan være maks ${BOARD_TITLE_MAX_LENGTH} tegn`,
    )
