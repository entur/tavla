'use server'
import { getOrganizationIfUserHasAccess } from 'app/(admin)/actions'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import admin, { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { DEFAULT_ORGANIZATION_COLUMNS } from 'types/column'
import { TBoard, TOrganization, TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function create(board: TBoard, oid?: TOrganizationID) {
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
                fontSize: organization?.defaults?.font ?? 'medium',
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

export async function createOrg(name: string) {
    const user = await getUserFromSessionCookie()

    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    const organization = await firestore()
        .collection('organizations')
        .add({
            name: name,
            owners: [user.uid],
            editors: [],
            boards: [],
            defaults: {
                columns: DEFAULT_ORGANIZATION_COLUMNS,
            },
        })
    if (!organization || !organization.id) return getFormFeedbackForError()

    return organization.id
}
