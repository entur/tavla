'use server'
import * as Sentry from '@sentry/nextjs'
import { initializeAdminApp } from 'app/(innlogget)/utils/firebase'
import {
    getFormFeedbackForError,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { handleError } from 'app/(innlogget)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import admin, { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import type { BoardDB } from 'src/types/db-types/boards'
import type { FolderDB } from 'src/types/db-types/folders'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function createBoard(
    _prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const name = data.get('name') as string
    if (!name) return getFormFeedbackForError('board/name-missing')

    const folderid = data.get('folderid') as FolderDB['id']

    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    let createdBoard: FirebaseFirestore.DocumentReference | undefined

    try {
        createdBoard = await firestore()
            .collection('boards')
            .add({
                tiles: [],
                theme: 'dark',
                isCombinedTiles: false,
                meta: {
                    title: name.substring(0, 50),
                    fontSize: 'medium',
                    created: Date.now(),
                    dateModified: Date.now(),
                },
            } as Omit<BoardDB, 'id'>)

        if (!createdBoard) return getFormFeedbackForError('firebase/general')

        await firestore()
            .collection(folderid ? 'folders' : 'users')
            .doc(folderid ? folderid : user.uid)
            .update({
                [folderid ? 'boards' : 'owner']:
                    admin.firestore.FieldValue.arrayUnion(createdBoard.id),
            })
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to create board for user ${user.uid}: ${error instanceof Error ? error.message : String(error)}`,
        )
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
