'use server'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
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
