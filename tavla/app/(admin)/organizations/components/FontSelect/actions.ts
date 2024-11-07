'use server'
import { getFormFeedbackForError } from 'app/(admin)/utils'
import {
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { FirebaseError } from 'firebase/app'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TFontSize } from 'types/meta'
import { TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function setFontSize(oid: TOrganizationID, fontSize: TFontSize) {
    const access = await userCanEditOrganization(oid)
    if (!access) return redirect('/')

    try {
        await firestore().collection('organizations').doc(oid).update({
            'defaults.font': fontSize,
        })
        revalidatePath(`/organizations/${oid}`)
    } catch (e) {
        if (e instanceof FirebaseError) return getFormFeedbackForError(e)
        return getFormFeedbackForError('general')
    }
}
