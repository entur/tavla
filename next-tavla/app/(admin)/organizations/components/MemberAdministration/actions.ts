'use server'
import { getOrganization } from 'app/(admin)/actions'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { userCanEditOrganization } from 'app/(admin)/utils/firebase'
import admin, { auth, firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'

export async function removeUser(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const organizationId = data.get('oid')?.toString() ?? ''
    const uid = data.get('uid')?.toString() ?? ''

    const access = await userCanEditOrganization(organizationId)
    if (!access) return getFormFeedbackForError('auth/operation-not-allowed')

    await firestore()
        .collection('organizations')
        .doc(organizationId)
        .update({
            owners: admin.firestore.FieldValue.arrayRemove(uid),
            editors: admin.firestore.FieldValue.arrayRemove(uid),
        })

    revalidatePath('/')
}

export async function inviteUser(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const oid = data.get('oid')?.toString() ?? ''

    const email = data.get('email')?.toString()
    if (!email) return getFormFeedbackForError('auth/invalid-email')

    const access = await userCanEditOrganization(oid)

    if (!access) return getFormFeedbackForError('auth/operation-not-allowed')

    const invitee = await auth()
        .getUserByEmail(email)
        .catch(() => undefined)

    if (!invitee) return getFormFeedbackForError('auth/user-not-found')

    const organization = await getOrganization(oid)

    if (!organization) return getFormFeedbackForError('organization/not-found')

    if (organization?.owners?.includes(invitee.uid))
        return getFormFeedbackForError('organization/user-already-invited')

    await firestore()
        .collection('organizations')
        .doc(oid)
        .update({
            owners: admin.firestore.FieldValue.arrayUnion(invitee.uid),
        })

    revalidatePath('/')
}
