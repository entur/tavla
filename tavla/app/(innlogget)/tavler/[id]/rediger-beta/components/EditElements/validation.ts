import { z } from 'zod'

export const elementsSchema = z.object({
    hideClock: z.boolean(),
    hideLogo: z.boolean(),
})
export type ElementsValue = z.infer<typeof elementsSchema>
