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

export type FormState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

export async function saveCustomUrl(
    bid: BoardDB['id'],
    _prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    logToGcp('info', 'action:saveCustomUrl invoked', { bid })
    const access = await userCanEditBoard(bid)
    if (!access) return redirect('/')

    const parsed = customUrlSchema.safeParse(
        formData.get('customUrl')?.toString() ?? '',
    )
    if (!parsed.success) {
        return {
            status: 'error',
            message: parsed.error.issues[0]?.message ?? 'Ugyldig lenke',
        }
    }
    const trimmed = parsed.data

    try {
        if (trimmed) {
            const existing = await getBoardByCustomUrl(trimmed)
            if (existing && existing.id !== bid) {
                return {
                    status: 'error',
                    message: 'Denne lenken er allerede i bruk.',
                }
            }
        }

        await updateBoard(bid, {
            customUrl: trimmed || FieldValue.delete(),
        })
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
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)
    return { status: 'success' }
}
