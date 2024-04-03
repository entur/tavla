'use server'
import {
    initializeAdminApp,
    userCanEditOrganization,
} from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { redirect } from 'next/navigation'
import { TFontSize } from 'types/meta'
import { TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function setFontSize(oid: TOrganizationID, fontSize: TFontSize) {
    const access = await userCanEditOrganization(oid)
    if (!access) return redirect('/')

    await firestore().collection('organizations').doc(oid).update({
        'defaults.font': fontSize,
    })
}
