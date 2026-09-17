'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateBoard } from 'src/firebase'
import { logToGcp } from 'src/utils/logging'
import { boardTitleSchema } from './validation'

initializeAdminApp()

export type FormState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

export async function saveBoardTitle(
    bid: string,
    _prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action:saveBoardTitle invoked', { bid })

    const parsed = boardTitleSchema.safeParse(
        formData.get('title')?.toString() ?? '',
    )
    if (!parsed.success)
        return {
            status: 'error',
            message: parsed.error.issues[0]?.message ?? 'Ugyldig navn',
        }

    try {
        await updateBoard(bid, { 'meta.title': parsed.data })
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save board title: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)
    return { status: 'success' }
}
