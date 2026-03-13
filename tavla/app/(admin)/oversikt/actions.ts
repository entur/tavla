'use server'
import * as Sentry from '@sentry/nextjs'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import admin, { firestore } from 'firebase-admin'
import { BoardDB } from 'src/types/db-types/boards'

initializeAdminApp()

export async function saveBoardToFirebaseForUser(
    board: BoardDB,
): Promise<string> {
    const user = await getUserFromSessionCookie()
    if (!user) {
        throw new Error('Not authenticated')
    }

    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...boardData } = board
    const now = Date.now()

    try {
        const doc = await firestore()
            .collection('boards')
            .add({
                ...boardData,
                meta: {
                    ...boardData.meta,
                    created: now,
                    dateModified: now,
                },
            })

        await firestore()
            .collection('users')
            .doc(user.uid)
            .update({
                owner: admin.firestore.FieldValue.arrayUnion(doc.id),
            })

        return doc.id
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message:
                    'Error while saving board from localStorage to firebase for user',
                userID: user.uid,
            },
        })
        throw new Error('Failed to save board from localStorage to firebase', {
            cause: error,
        })
    }
}
