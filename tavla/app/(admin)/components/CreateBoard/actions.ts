'use server'
import { getOrganizationIfUserHasAccess } from 'app/(admin)/actions'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import admin, { firestore } from 'firebase-admin'
import { FirebaseError } from 'firebase/app'
import { redirect } from 'next/navigation'
import { TBoard, TOrganization, TOrganizationID } from 'types/settings'

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

    if (!createdBoard) return getFormFeedbackForError('firebase/general')

    try {
        firestore()
            .collection(oid ? 'organizations' : 'users')
            .doc(oid ? String(oid) : String(user.uid))
            .update({
                [oid ? 'boards' : 'owner']:
                    admin.firestore.FieldValue.arrayUnion(createdBoard.id),
            })
    } catch (e) {
        if (e instanceof FirebaseError) return getFormFeedbackForError(e)
        return getFormFeedbackForError('firebase/general')
    }

    redirect(`/edit/${createdBoard.id}`)
}
