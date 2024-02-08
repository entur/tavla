'use server'

import { initializeAdminApp } from 'Admin/utils/firebase'
import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import admin, { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TBoard, TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function createBoard(board: TBoard, oid?: TOrganizationID) {
    console.log('board', board)
    console.log('board.meta', board.meta)
    console.log('board', board)
    console.log('board.meta', board.meta)
    const user = await getUserFromSessionCookie()

    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')
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
    console.log('createdBoard', createdBoard)

    firestore()
        .collection(oid ? 'organizations' : 'users')
        .doc(oid ? String(oid) : String(user.id))
        .update({
            [oid ? 'boards' : 'owner']: admin.firestore.FieldValue.arrayUnion(
                createdBoard.id,
            ),
        })
    revalidatePath(`/edit/${createdBoard.id}`)
    redirect(`/edit/${createdBoard.id}`)
}
