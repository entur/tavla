'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    userCanEditBoard,
} from 'app/(innlogget)/utils/firebase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateBoard } from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export type PublishState =
    | { status: 'success' }
    | { status: 'error'; message: string }
    | null

export async function publishDraftBoard(
    bid: BoardDB['id'],
): Promise<PublishState> {
    if (!(await userCanEditBoard(bid))) redirect('/')
    logToGcp('info', 'action invoked: publishDraftBoard', {
        type: 'server-action',
        action: 'publishDraftBoard',
        bid,
    })

    try {
        await updateBoard(bid, { isDraft: false })
    } catch (error) {
        logToGcp('error', 'action failed: publishDraftBoard', {
            type: 'server-action',
            action: 'publishDraftBoard',
            bid,
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
        })
        Sentry.captureException(error, { extra: { boardID: bid } })
        return { status: 'error', message: 'Noe gikk galt. Prøv igjen.' }
    }

    revalidatePath(`/tavler/${bid}/rediger-beta`)
    revalidatePath(`/lag-tavle/${bid}`)

    return { status: 'success' }
}
