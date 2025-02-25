'use server'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import {
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TOrganizationID } from 'types/settings'
import * as Sentry from '@sentry/nextjs'

initializeAdminApp()

export async function setCounties(
    oid: TOrganizationID | undefined,
    data: FormData,
) {
    if (!oid) return getFormFeedbackForError()
    const access = userCanEditOrganization(oid)
    if (!access) return redirect('/')
    const counties = data.getAll('county') as string[]

    try {
        await firestore().collection('organizations').doc(oid).update({
            'defaults.counties': counties,
        })
        revalidatePath(`/folders/${oid}`)
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while setting counties in organization',
                orgID: oid,
            },
        })
        return handleError(error)
    }
}
