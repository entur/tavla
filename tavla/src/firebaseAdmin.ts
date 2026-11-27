import 'server-only'
import type { App } from 'firebase-admin/app'
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

function getAdminApp(): App {
    return (
        getApps()[0] ??
        initializeApp({
            credential: applicationDefault(),
            projectId: process.env.GOOGLE_PROJECT_ID,
        })
    )
}

export const adminDb = () => getFirestore(getAdminApp())
export const adminAuth = () => getAuth(getAdminApp())
export const adminStorage = () => getStorage(getAdminApp())
