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
import { type ElementsValue, elementsSchema } from './validation'

initializeAdminApp()

export type ElementsState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

export async function saveElements(
    bid: string,
    value: ElementsValue,
): Promise<ElementsState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action:saveElements invoked', { bid })

    const parsed = elementsSchema.safeParse(value)
    if (!parsed.success)
        return {
            status: 'error',
            message:
                parsed.error.issues[0]?.message ?? 'Ugyldig valg av elementer',
        }

    try {
        await updateBoard(bid, {
            hideClock: parsed.data.hideClock,
            hideLogo: parsed.data.hideLogo,
        })
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save elements: ${error instanceof Error ? error.message : String(error)}`,
            { bid },
        )
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)

    return { status: 'success' }
}
