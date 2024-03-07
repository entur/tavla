'use server'
import { initializeAdminApp } from 'Admin/utils/firebase'
import { firestore } from 'firebase-admin'
import { TOrganizationID, TOrganization } from 'types/settings'

initializeAdminApp()

export async function getOrganization(oid?: TOrganizationID) {
    if (!oid) return undefined
    const doc = await firestore().collection('organizations').doc(oid).get()
    return { ...doc.data(), id: doc.id } as TOrganization
}
