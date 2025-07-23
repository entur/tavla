'use server'
import * as Sentry from '@sentry/nextjs'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import admin, { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { TBoard, TFolderID } from 'types/settings'

initializeAdminApp()

export async function createBoard(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const name = data.get('name') as string
    if (!name) return getFormFeedbackForError('board/name-missing')

    const oid = data.get('oid') as TFolderID

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
            } as TBoard)

        if (!createdBoard) return getFormFeedbackForError('firebase/general')

        await firestore()
            .collection(oid ? 'folders' : 'users')
            .doc(oid ? oid : user.uid)
            .update({
                [oid ? 'boards' : 'owner']:
                    admin.firestore.FieldValue.arrayUnion(createdBoard.id),
            })
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message:
                    'Error while adding newly created board to either user or folder',
                userID: user.uid,
                folderID: oid,
            },
        })
        return handleError(error)
    }

    redirect(`/tavler/${createdBoard.id}/rediger`)
}
