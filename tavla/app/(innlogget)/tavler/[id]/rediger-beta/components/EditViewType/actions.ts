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
import { viewTypeSchema } from './validation'

initializeAdminApp()

export type FormState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

//tilsvarer isCombinedTiles-delen i saveSettings() fra rediger/components/Settings/actions.ts
export async function saveViewType(
    bid: string,
    _prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action:saveViewType invoked', { bid })

    const parsed = viewTypeSchema.safeParse(
        formData.get('viewType')?.toString(),
    )
    if (!parsed.success)
        return {
            status: 'error',
            message: parsed.error.issues[0]?.message ?? 'Ugyldig visningstype',
        }

    try {
        await updateBoard(bid, {
            isCombinedTiles: parsed.data === 'combined',
        })
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save view type: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)

    return { status: 'success' }
}
