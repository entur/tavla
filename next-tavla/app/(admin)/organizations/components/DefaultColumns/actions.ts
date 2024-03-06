'use server'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { firestore } from 'firebase-admin'
import { TColumn } from 'types/column'
import { TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function saveColumns(oid: TOrganizationID, columns: TColumn[]) {
    await firestore().collection('organizations').doc(oid).update({
        'defaults.columns': columns,
    })
}
