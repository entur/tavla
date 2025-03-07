'use server'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import admin, { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { TBoard, TOrganizationID } from 'types/settings'
import * as Sentry from '@sentry/nextjs'

initializeAdminApp()

export async function createBoard(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const name = data.get('name') as string
    if (!name) return getFormFeedbackForError('board/name-missing')

    const oid = data.get('organization') as TOrganizationID
    const personal = data.get('personal')
    if (!oid && !personal)
        return getFormFeedbackForError('create/organization-missing')

    const board = {
        tiles: [],
        meta: {
            title: name.substring(0, 50),
        },
    } as TBoard

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

        if (!createdBoard) return getFormFeedbackForError('firebase/general')

        firestore()
            .collection(oid ? 'organizations' : 'users')
            .doc(oid ? String(oid) : String(user.uid))
            .update({
                [oid ? 'boards' : 'owner']:
                    admin.firestore.FieldValue.arrayUnion(createdBoard.id),
            })
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message:
                    'Error while adding newly created board to either user or org',
                userID: user.uid,
                orgID: oid,
            },
        })
        return handleError(error)
    }

    redirect(`/edit/${createdBoard.id}`)
}
