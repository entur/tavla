import { z } from 'zod'

export const transportPaletteSchema = z.enum([
    'default',
    'blue-bus',
    'green-bus',
    'brakar',
    'atb',
    'fram',
    'reis',
])

export type TransportPaletteValue = z.infer<typeof transportPaletteSchema>
