'use server'

import { getFormFeedbackForError } from 'app/(admin)/utils'
import { revalidatePath } from 'next/cache'
import { TLogo, TOrganizationID } from 'types/settings'
import { getFilename } from './utils'
import { storage, firestore } from 'firebase-admin'
import {
    getConfig,
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'
initializeAdminApp()

export async function remove(oid?: TOrganizationID, logo?: TLogo) {
    if (!oid || !logo)
        return getFormFeedbackForError('auth/operation-not-allowed')

    const file = getFilename(logo)

    if (!file) return getFormFeedbackForError()

    const access = userCanEditOrganization(oid)
    if (!access) return redirect('/')

    const bucket = storage().bucket((await getConfig()).bucket)
    const logoFile = bucket.file('logo/' + file)

    await logoFile.delete()

    await firestore().collection('organizations').doc(oid).update({
        logo: firestore.FieldValue.delete(),
    })

    revalidatePath('/')
}
