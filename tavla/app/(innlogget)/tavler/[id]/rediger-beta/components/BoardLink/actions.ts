'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getBoardByCustomUrl, updateBoard } from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'
import { customUrlSchema } from './validation'

initializeAdminApp()

// Dette er en kopi av saveCustomUrl fra tavla/app/(innlogget)/tavler/[id]/rediger/actions.ts, men med revalidatePath som peker til /rediger-beta i stedet for /rediger, og med zod-validering (customUrlSchema) i stedet for den gamle regex-baserte validateCustomUrl.
export async function saveCustomUrl(
    bid: BoardDB['id'],
    customUrl: string,
): Promise<{ error?: string }> {
    logToGcp('info', 'action:saveCustomUrl invoked', { bid })
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    const parsed = customUrlSchema.safeParse(customUrl)
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? 'Ugyldig lenke' }
    }
    const trimmed = parsed.data

    try {
        if (trimmed) {
            const existing = await getBoardByCustomUrl(trimmed)
            if (existing && existing.id !== bid) {
                return { error: 'Denne lenken er allerede i bruk.' }
            }
        }

        await updateBoard(bid, {
            customUrl: trimmed || FieldValue.delete(),
        })

        revalidatePath(`/tavler/${bid}/rediger-beta`)
        return {}
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save custom URL for board: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while saving custom board URL',
                boardID: bid,
            },
        })
        return { error: 'Noe gikk galt. Prøv igjen.' }
    }
}
