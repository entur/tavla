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
import {
    type TransportPaletteValue,
    transportPaletteSchema,
} from './validation'

initializeAdminApp()

export type TransportPaletteState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

export async function saveTransportPalette(
    bid: string,
    value: TransportPaletteValue,
): Promise<TransportPaletteState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action invoked', {
        type: 'server-action',
        action: 'saveTransportPalette',
        bid,
    })

    const parsed = transportPaletteSchema.safeParse(value)
    if (!parsed.success)
        return {
            status: 'error',
            message:
                parsed.error.issues[0]?.message ??
                'Ugyldig farge på transportmiddel',
        }

    try {
        await updateBoard(bid, { transportPalette: parsed.data })
    } catch (error) {
        logToGcp('error', 'action failed', {
            type: 'server-action',
            action: 'saveTransportPalette',
            bid,
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
        })
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)

    return { status: 'success' }
}
