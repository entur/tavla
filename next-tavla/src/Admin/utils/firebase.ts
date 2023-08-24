import admin, { auth } from 'firebase-admin'
import { applicationDefault, getApp } from 'firebase-admin/app'

const app = initializeOrGetAdminApp()

export function initializeOrGetAdminApp() {
    if (admin.apps.length <= 0) {
        return admin.initializeApp({
            credential: applicationDefault(),
        })
    }
    return getApp()
}

export async function verifySession(session?: string) {
    if (!session) return null
    try {
        return await auth(app).verifySessionCookie(session, true)
    } catch {
        return null
    }
}
