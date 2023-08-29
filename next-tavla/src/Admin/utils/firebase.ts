import admin, { auth } from 'firebase-admin'
import { cert } from 'firebase-admin/app'

export function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp({
            credential: cert(JSON.parse(process.env.SERVICE_ACCOUNT ?? '')),
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
