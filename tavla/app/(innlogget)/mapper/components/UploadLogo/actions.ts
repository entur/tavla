'use server'

import * as Sentry from '@sentry/nextjs'
import {
    getConfig,
    initializeAdminApp,
    userCanEditFolder,
} from 'app/(innlogget)/utils/firebase'
import { getFormFeedbackForError } from 'app/(innlogget)/utils/forms'
import { handleError } from 'app/(innlogget)/utils/handleError'
import { firestore, storage } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { FolderDB } from 'src/types/db-types/folders'
import { logToGcp } from 'src/utils/logging'
import { getFilename } from './utils'

initializeAdminApp()

export async function remove(
    folderid?: FolderDB['id'],
    logo?: FolderDB['logo'],
) {
    if (!folderid || !logo)
        return getFormFeedbackForError('auth/operation-not-allowed')

    await logToGcp('info', 'action:removeLogo invoked', { folderId: folderid })
    const file = getFilename(logo)

    if (!file) return getFormFeedbackForError()

    const access = userCanEditFolder(folderid)
    if (!access) return redirect('/')

    try {
        const bucket = storage().bucket((await getConfig()).bucket)
        const logoFile = bucket.file('logo/' + file)

        await logoFile.delete()

        await firestore().collection('folders').doc(folderid).update({
            logo: firestore.FieldValue.delete(),
        })

        revalidatePath('/')
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to remove logo from folder ${folderid}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while removing logo from folder',
                folderID: folderid,
                fileName: file,
            },
        })
        return handleError(error)
    }
}
