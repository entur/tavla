'use server'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { DEFAULT_ORGANIZATION_COLUMNS } from 'types/column'

initializeAdminApp()

export async function createOrganization(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const name = data.get('name')?.toString() ?? ''

    const oid = await saveOrganization(name)

    if (typeof oid === 'string') {
        redirect(`/organizations/${oid}`)
    }

    return oid
}

export async function saveOrganization(name: string) {
    if (!name || /^\s*$/.test(name)) {
        return getFormFeedbackForError('organization/name-missing')
    }

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
