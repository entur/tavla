'use server'
import * as Sentry from '@sentry/nextjs'
import { isOnlyWhiteSpace } from 'app/(innlogget)/tavler/[id]/utils'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateBoard } from 'src/firebase'
import { logToGcp } from 'src/utils/logging'
import { infoMessageSchema } from './validation'

initializeAdminApp()

export type FormState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

export async function saveInfoMessage(
    bid: string,
    _prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action:saveInfoMessage invoked', { bid })

    const parsed = infoMessageSchema.safeParse(
        formData.get('infoMessage')?.toString() ?? '',
    )
    if (!parsed.success)
        return {
            status: 'error',
            message: parsed.error.issues[0]?.message ?? 'Ugyldig infomelding',
        }

    const infoMessage = parsed.data
    const hasInfoMessage = infoMessage && !isOnlyWhiteSpace(infoMessage)

    try {
        await updateBoard(bid, {
            footer: hasInfoMessage
                ? { footer: infoMessage }
                : FieldValue.delete(),
        })
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save info message: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)
    return { status: 'success' }
}
