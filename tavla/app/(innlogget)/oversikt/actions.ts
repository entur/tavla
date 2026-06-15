'use server'
import * as Sentry from '@sentry/nextjs'
import { initializeAdminApp } from 'app/(innlogget)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import { addBoardIdToUser, createBoard } from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function saveBoardToFirebaseForUser(
    board: BoardDB,
): Promise<string> {
    const user = await getUserFromSessionCookie()
    if (!user) {
        throw new Error('Not authenticated')
    }
    logToGcp('info', 'action:saveBoardToFirebaseForUser invoked')

    const { id: _id, ...boardData } = board // We don't want to use the localStorage board ID in firebase, so we remove it before saving. Firebase will generate a new ID for us.

    try {
        const doc = await createBoard({
            ...boardData,
        })

        await addBoardIdToUser(user.uid, doc.id)

        return doc.id
    } catch (error) {
        logToGcp(
            'error',
            `Failed to save board from localStorage: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message:
                    'Error while saving board from localStorage to firebase for user',
            },
        })
        throw new Error('Failed to save board from localStorage to firebase', {
            cause: error,
        })
    }
}
