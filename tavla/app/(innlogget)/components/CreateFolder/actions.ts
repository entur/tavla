'use server'

import * as Sentry from '@sentry/nextjs'
import { initializeAdminApp } from 'app/(innlogget)/utils/firebase'
import {
    getFormFeedbackForError,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { handleError } from 'app/(innlogget)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import { redirect } from 'next/navigation'
import { addFolder } from 'src/firebase'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function createFolder(
    _prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const name = data.get('name')?.toString() ?? ''

    if (!name || /^\s*$/.test(name))
        return getFormFeedbackForError('folder/name-missing')

    const user = await getUserFromSessionCookie()

    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')

    let folder: FirebaseFirestore.DocumentReference | undefined

    try {
        folder = await addFolder(name.substring(0, 50), user.uid)
        if (!folder || !folder.id) return getFormFeedbackForError()
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to create folder: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while creating new folder in firestore',
            },
        })
        return handleError(error)
    }
    redirect(`/mapper/${folder.id}`)
}
