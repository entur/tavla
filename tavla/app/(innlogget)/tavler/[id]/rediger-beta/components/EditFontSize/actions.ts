'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateBoard } from 'src/firebase'
import { logToGcp } from 'utils/logging'
import { type FontSizeValue, fontSizeSchema } from './validation'

initializeAdminApp()

export type FontSizeState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

export async function saveFontSize(
    bid: string,
    value: FontSizeValue,
): Promise<FontSizeState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action:saveFontSize invoked', { bid })

    const parsed = fontSizeSchema.safeParse(value)
    if (!parsed.success)
        return {
            status: 'error',
            message:
                parsed.error.issues[0]?.message ?? 'Ugyldig tekststørrelse',
        }

    try {
        await updateBoard(bid, { 'meta.fontSize': parsed.data })
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save fontSize: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)

    return { status: 'success' }
}
