'use server'

import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import { handleError } from 'app/(admin)/utils/handleError'

initializeAdminApp()

export async function createOrganization(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const name = data.get('name')?.toString() ?? ''

    if (!name || /^\s*$/.test(name))
        return getFormFeedbackForError('organization/name-missing')

    const user = await getUserFromSessionCookie()

    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    let organization = null

    try {
        organization = await firestore()
            .collection('organizations')
            .add({
                name: name.substring(0, 50),
                owners: [user.uid],
                boards: [],
            })
        if (!organization || !organization.id) return getFormFeedbackForError()
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while creating new organization in firestore',
            },
        })
        return handleError(error)
    }
    redirect(`/mapper/${organization.id}`)
}
