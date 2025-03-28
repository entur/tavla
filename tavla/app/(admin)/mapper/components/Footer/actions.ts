'use server'
import { isOnlyWhiteSpace } from 'app/(admin)/tavler/[id]/utils'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import { userCanEditOrganization } from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TOrganizationID } from 'types/settings'
import * as Sentry from '@sentry/nextjs'

export async function setFooter(
    oid: TOrganizationID | undefined,
    data: FormData,
) {
    if (!oid) return getFormFeedbackForError()
    const access = await userCanEditOrganization(oid)
    if (!access) return redirect('/')

    const message = data.get('footer') as string

    const validMessage =
        message && !isOnlyWhiteSpace(message) && message.trim() !== ''

    try {
        await firestore()
            .collection('organizations')
            .doc(oid)
            .update({
                footer: validMessage ? message : firestore.FieldValue.delete(),
            })
        revalidatePath(`organizations/${oid}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while setting organization footer',
                orgID: oid,
                footerMessage: message,
            },
        })
        return handleError(error)
    }
}
