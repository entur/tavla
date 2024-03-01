'use server'
import { firestore } from 'firebase-admin'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { TCountyID, TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function setCounties(
    oid: TOrganizationID,
    countiesList: TCountyID[],
) {
    await firestore().collection('organizations').doc(oid).update({
        'defaults.counties': countiesList,
    })
}
