'use server'
import * as Sentry from '@sentry/nextjs'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import admin, { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { BoardDB } from 'types/db-types/boards'
import { FolderId } from 'types/db-types/folders'

initializeAdminApp()

export async function createBoard(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const name = data.get('name') as string
    if (!name) return getFormFeedbackForError('board/name-missing')

    const folderid = data.get('folderid') as FolderId

    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    let createdBoard = null

    try {
        createdBoard = await firestore()
            .collection('boards')
            .add({
                tiles: [],
                meta: {
                    title: name.substring(0, 50),
                    fontSize: 'medium',
                    created: Date.now(),
                    dateModified: Date.now(),
                },
            } as BoardDB)

        if (!createdBoard) return getFormFeedbackForError('firebase/general')

        await firestore()
            .collection(folderid ? 'folders' : 'users')
            .doc(folderid ? folderid : user.uid)
            .update({
                [folderid ? 'boards' : 'owner']:
                    admin.firestore.FieldValue.arrayUnion(createdBoard.id),
            })
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message:
                    'Error while adding newly created board to either user or folder',
                userID: user.uid,
                folderID: folderid,
            },
        })
        return handleError(error)
    }

    redirect(`/tavler/${createdBoard.id}/rediger`)
}
