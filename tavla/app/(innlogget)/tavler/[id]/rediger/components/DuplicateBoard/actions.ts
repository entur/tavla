'use server'
import * as Sentry from '@sentry/nextjs'
import {
    initializeAdminApp,
    userCanEditFolder,
} from 'app/(innlogget)/utils/firebase'
import { getFormFeedbackForError } from 'app/(innlogget)/utils/forms'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import { redirect } from 'next/navigation'
import { addBoard, addBoardIdToFolder, addBoardIdToUser } from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import type { FolderDB } from 'src/types/db-types/folders'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function duplicateBoard(
    board: Omit<BoardDB, 'id'>,
    folderid?: FolderDB['id'],
) {
    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    try {
        if (folderid) {
            const access = await userCanEditFolder(folderid)
            if (!access)
                return getFormFeedbackForError('auth/operation-not-allowed')
        }

        const createdBoard = await addBoard(board)

        if (folderid) {
            await addBoardIdToFolder(folderid, createdBoard.id)
        } else {
            await addBoardIdToUser(user.uid, createdBoard.id)
        }
        redirect(`/tavler/${createdBoard.id}/rediger`)
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to duplicate board: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureMessage('Error while duplicating board object: ' + board)
        throw error
    }
}
