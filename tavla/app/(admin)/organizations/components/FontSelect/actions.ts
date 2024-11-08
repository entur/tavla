'use server'
import {
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { firestore } from 'firebase-admin'
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
        return handleError(e)
    }
}
