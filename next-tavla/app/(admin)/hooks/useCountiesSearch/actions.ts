'use server'
import { firestore } from 'firebase-admin'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { TOrganizationID } from 'types/settings'

initializeAdminApp()

export async function getCountiesForOrganization(oid?: TOrganizationID) {
    if (!oid) return null

    const organization = await firestore()
        .collection('organizations')
        .doc(oid)
        .get()

    return organization.data()?.counties
}
