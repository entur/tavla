import admin, { auth } from 'firebase-admin'
import { applicationDefault, getApps } from 'firebase-admin/app'

initializeAdminApp()

export async function initializeAdminApp() {
    if (getApps().length <= 0) {
        admin.initializeApp({
            credential: applicationDefault(),
        })
    }
}

export async function verifySession(session?: string) {
    if (!session) return null
    try {
        return await auth().verifySessionCookie(session, true)
    } catch {
        return null
    }
}
