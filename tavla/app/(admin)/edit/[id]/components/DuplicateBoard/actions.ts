'use server'
import { getOrganizationIfUserHasAccess } from 'app/(admin)/actions'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import admin, { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { TBoard, TOrganization, TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function duplicateBoard(board: TBoard, oid?: TOrganizationID) {
    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    let organization: TOrganization | undefined
    if (oid) organization = await getOrganizationIfUserHasAccess(oid)

    const createdBoard = await firestore()
        .collection('boards')
        .add({
            ...board,
            meta: {
                ...board.meta,
                fontSize:
                    board.meta?.fontSize ??
                    organization?.defaults?.font ??
                    'medium',
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
