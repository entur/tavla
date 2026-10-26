import { z } from 'zod'

export const languageSchema = z.enum(['nb', 'en'])
export type LanguageValue = z.infer<typeof languageSchema>
