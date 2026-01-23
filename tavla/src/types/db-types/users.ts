import { z } from 'zod'

export const UserDBSchema = z.object({
    uid: z.string(),
    owner: z.array(z.string()).optional(),
})

export type UserDB = z.infer<typeof UserDBSchema>
