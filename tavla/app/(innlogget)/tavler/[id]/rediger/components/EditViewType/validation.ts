import { z } from 'zod'

export const viewTypeSchema = z.enum(['separate', 'combined'])
export type ViewTypeValue = z.infer<typeof viewTypeSchema>
