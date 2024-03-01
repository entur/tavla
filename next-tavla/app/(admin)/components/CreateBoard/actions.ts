'use server'
import { getOrganization } from 'Admin/utils/firebase'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import admin, { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { TBoard, TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function create(board: TBoard, oid?: TOrganizationID) {
    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    const organization = await getOrganization(oid)

    const createdBoard = await firestore()
        .collection('boards')
        .add({
            ...board,
            meta: {
                ...board.meta,
                fontSize: organization?.defaults?.fontSize || 'medium',
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
