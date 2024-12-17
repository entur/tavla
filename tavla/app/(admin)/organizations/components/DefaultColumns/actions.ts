'use server'
import { getFormFeedbackForError, TFormFeedback } from 'app/(admin)/utils'
import {
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TColumn } from 'types/column'
import { TOrganizationID } from 'types/settings'
import * as Sentry from '@sentry/nextjs'

initializeAdminApp()

export async function saveColumns(
    state: TFormFeedback | undefined,
    oid: TOrganizationID | undefined,
    data: FormData,
) {
    if (!oid) return getFormFeedbackForError()
    const access = userCanEditOrganization(oid)
    if (!access) return redirect('/')

    const columns = data.getAll('columns') as TColumn[]
    if (columns.length === 0)
        return getFormFeedbackForError('organization/invalid-columns')

    try {
        await firestore().collection('organizations').doc(oid).update({
            'defaults.columns': columns,
        })
        revalidatePath(`/organizations/${oid}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while saving columns in organization',
                orgID: oid,
                columnsList: columns,
            },
        })
        return handleError(error)
    }
}
