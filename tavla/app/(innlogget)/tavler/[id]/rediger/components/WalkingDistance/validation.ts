import { z } from 'zod'

export const locationSchema = z.object({
    name: z.string().optional(),
    coordinate: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
})
