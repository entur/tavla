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
import { type LanguageValue, languageSchema } from './validation'

initializeAdminApp()

export type LanguageState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

export async function saveLanguage(
    bid: string,
    value: LanguageValue,
): Promise<LanguageState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action:saveLanguage invoked', { bid })

    const parsed = languageSchema.safeParse(value)
    if (!parsed.success)
        return {
            status: 'error',
            message: parsed.error.issues[0]?.message ?? 'Ugyldig språk',
        }

    try {
        await updateBoard(bid, { language: parsed.data })
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save language: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)

    return { status: 'success' }
}
