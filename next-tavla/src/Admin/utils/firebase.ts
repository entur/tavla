import { initializeApp } from 'firebase-admin'
import { cert } from 'firebase-admin/app'
import { getApps } from 'firebase/app'

const FIREBASE_ADMIN_CONFIG = {
    credential: cert(process.env.FIREBASE_SECRET_KEY ?? ''),
}

export function initializeAdminApp() {
    if (getApps().length <= 0) {
        initializeApp(FIREBASE_ADMIN_CONFIG)
    }
}
