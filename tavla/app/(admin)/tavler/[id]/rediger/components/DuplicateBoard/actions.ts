'use server'
import * as Sentry from '@sentry/nextjs'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import admin, { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { BoardDB } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'

initializeAdminApp()

export async function duplicateBoard(
    board: Omit<BoardDB, 'id'>,
    folderid?: FolderDB['id'],
) {
    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    let createdBoard = null

    try {
        createdBoard = await firestore()
            .collection('boards')
            .add({
                ...board,
                meta: {
                    ...board.meta,
                    fontSize: board.meta?.fontSize ?? 'medium',
                    created: Date.now(),
                    dateModified: Date.now(),
                },
            })

        if (!createdBoard || !createdBoard.id)
            throw Error('failed to create board')

        firestore()
            .collection(folderid ? 'folders' : 'users')
            .doc(folderid ? String(folderid) : String(user.uid))
            .update({
                [folderid ? 'boards' : 'owner']:
                    admin.firestore.FieldValue.arrayUnion(createdBoard.id),
            })
    } catch (error) {
        Sentry.captureMessage('Error while duplicating board object: ' + board)
        throw error
    }
    redirect(`/tavler/${createdBoard.id}/rediger`)
}
