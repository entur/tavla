import admin, { auth } from 'firebase-admin'
import { applicationDefault } from 'firebase-admin/app'

initializeAdminApp()

export function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp({
            credential: applicationDefault(),
            databaseURL:
                process.env.DATABASE_URL ??
                'https://entur-tavla-staging.firebaseio.com',
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
