'use server'
import { getOrganizationIfUserHasAccess } from 'app/(admin)/actions'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import {
    removeUserFromOrg,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import admin, { auth, firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import { handleError } from 'app/(admin)/utils/handleError'

export async function removeUserAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const folderId = data.get('oid')?.toString() ?? ''
    const uid = data.get('uid')?.toString() ?? ''

    const access = await userCanEditOrganization(folderId)
    if (!access) return redirect('/')

    try {
        await removeUserFromOrg(folderId, uid)
        revalidatePath('/')
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while removing user from organization',
                orgID: folderId,
                userID: uid,
            },
        })
        return handleError(error)
    }
}

export async function inviteUserAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const oid = data.get('oid')?.toString() ?? ''

    const email = data.get('email')?.toString()
    if (!email) return getFormFeedbackForError('auth/invalid-email')

    const access = await userCanEditOrganization(oid)
    if (!access) return redirect('/')

    const invitee = await auth()
        .getUserByEmail(email)
        .catch(() => undefined)

    if (!invitee) return getFormFeedbackForError('auth/user-not-found')

    const organization = await getOrganizationIfUserHasAccess(oid)

    if (!organization) return getFormFeedbackForError('folder/not-found')

    if (organization?.owners?.includes(invitee.uid))
        return getFormFeedbackForError('folder/user-already-invited')

    try {
        await firestore()
            .collection('organizations')
            .doc(oid)
            .update({
                owners: admin.firestore.FieldValue.arrayUnion(invitee.uid),
            })
        revalidatePath('/')
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while inviting user to organization',
                orgID: oid,
                inviteeID: invitee.uid,
            },
        })
        return handleError(error)
    }
}
