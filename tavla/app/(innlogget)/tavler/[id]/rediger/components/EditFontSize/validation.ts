import { z } from 'zod'

export const fontSizeSchema = z.enum(['small', 'medium', 'large'])
export type FontSizeValue = z.infer<typeof fontSizeSchema>
