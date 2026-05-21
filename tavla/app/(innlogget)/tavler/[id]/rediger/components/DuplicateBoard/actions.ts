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

    let createdBoard: FirebaseFirestore.DocumentReference | undefined

    try {
        createdBoard = await addBoard({
            ...board,
            meta: {
                ...board.meta,
            },
        })

        if (!createdBoard || !createdBoard.id)
            throw Error('failed to create board')

        if (folderid) {
            const access = await userCanEditFolder(folderid)
            if (!access)
                return getFormFeedbackForError('auth/operation-not-allowed')
            await addBoardIdToFolder(folderid, createdBoard.id)
        } else {
            await addBoardIdToUser(user.uid, createdBoard.id)
        }
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to duplicate board: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureMessage('Error while duplicating board object: ' + board)
        throw error
    }
    redirect(`/tavler/${createdBoard.id}/rediger`)
}
