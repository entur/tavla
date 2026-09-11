import { z } from 'zod'

export const transportPaletteSchema = z.enum([
    'default',
    'blue-bus',
    'green-bus',
    'atb',
    'fram',
    'reis',
])

export type TransportPaletteValue = z.infer<typeof transportPaletteSchema>
