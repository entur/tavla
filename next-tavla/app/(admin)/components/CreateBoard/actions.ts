'use server'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import admin, { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { TBoard, TOrganizationID } from 'types/settings'
import { TTile } from 'types/tile'

initializeAdminApp()

export async function create(
    tiles: TTile[],
    title: string,
    oid?: TOrganizationID,
) {
    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')
    const board = {
        tiles: tiles,
        meta: {
            title: title,
            created: Date.now(),
            dateModified: Date.now(),
        },
    } as TBoard
    const createdBoard = await firestore()
        .collection('boards')
        .add({
            ...board,
            meta: {
                ...board.meta,
                created: Date.now(),
                dateModified: Date.now(),
            },
        })

    firestore()
        .collection(oid ? 'organizations' : 'users')
        .doc(oid ? String(oid) : String(user.uid))
        .update({
            [oid ? 'boards' : 'owner']: admin.firestore.FieldValue.arrayUnion(
                createdBoard.id,
            ),
        })

    redirect(`/edit/${createdBoard.id}`)
}
