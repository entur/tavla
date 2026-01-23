import { z } from 'zod'

export const FolderDBSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    owners: z.array(z.string()).optional(),
    boards: z.array(z.string()).optional(),
    logo: z.string().optional(),
})

export type FolderDB = z.infer<typeof FolderDBSchema>
