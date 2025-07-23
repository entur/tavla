'use server'

import * as Sentry from '@sentry/nextjs'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import {
    getConfig,
    initializeAdminApp,
    userCanEditFolder,
} from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore, storage } from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TFolderID, TLogo } from 'types/settings'
import { getFilename } from './utils'

initializeAdminApp()

export async function remove(oid?: TFolderID, logo?: TLogo) {
    if (!oid || !logo)
        return getFormFeedbackForError('auth/operation-not-allowed')

    const file = getFilename(logo)

    if (!file) return getFormFeedbackForError()

    const access = userCanEditFolder(oid)
    if (!access) return redirect('/')

    try {
        const bucket = storage().bucket((await getConfig()).bucket)
        const logoFile = bucket.file('logo/' + file)

        await logoFile.delete()

        await firestore().collection('folders').doc(oid).update({
            logo: firestore.FieldValue.delete(),
        })

        revalidatePath('/')
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while removing logo from folder',
                folderID: oid,
                fileName: file,
            },
        })
        return handleError(error)
    }
}
