'use server'
import { isOnlyWhiteSpace } from 'app/(admin)/edit/utils'
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
    if (isOnlyWhiteSpace(message)) {
        return getFormFeedbackForError('footer/empty')
    }
    try {
        await firestore()
            .collection('organizations')
            .doc(oid)
            .update({
                footer: message ?? firestore.FieldValue.delete(),
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
