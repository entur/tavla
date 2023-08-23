import admin, { auth } from 'firebase-admin'
import { AppOptions, cert, getApps } from 'firebase-admin/app'

const FIREBASE_ADMIN_CONFIG = (process.env.FIREBASE_CONFIG as AppOptions) ?? {
    credential: cert(process.env.FIREBASE_SECRET_KEY ?? ''),
}

initializeAdminApp()

export function initializeAdminApp() {
    if (getApps().length <= 0) {
        admin.initializeApp(FIREBASE_ADMIN_CONFIG)
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
