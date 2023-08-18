import admin from 'firebase-admin'
import { cert, getApps } from 'firebase-admin/app'

const FIREBASE_ADMIN_CONFIG = {
    credential: cert(process.env.FIREBASE_SECRET_KEY ?? ''),
}

export function initializeAdminApp() {
    if (getApps().length <= 0) {
        admin.initializeApp(FIREBASE_ADMIN_CONFIG)
    }
}
