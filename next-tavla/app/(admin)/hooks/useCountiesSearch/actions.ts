'use server'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function getDefaultsForOrganization(oid?: TOrganizationID) {
    if (!oid) return null

    const organization = await firestore()
        .collection('organizations')
        .doc(oid)
        .get()

    return organization.data()?.defaults
}
