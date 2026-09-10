import { z } from 'zod'

export const themeSchema = z.enum(['light', 'dark'])
export type ThemeValue = z.infer<typeof themeSchema>
