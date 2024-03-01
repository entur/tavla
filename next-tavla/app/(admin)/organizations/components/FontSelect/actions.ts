'use server'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { firestore } from 'firebase-admin'
import { TFontSize } from 'types/meta'
import { TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function setFontSize(oid: TOrganizationID, fontSize: TFontSize) {
    await firestore().collection('organizations').doc(oid).update({
        'defaults.fontSize': fontSize,
    })
}
