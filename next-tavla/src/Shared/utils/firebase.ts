import { getApp, getApps, initializeApp } from 'firebase/app'
import { EmailAuthProvider, getAuth, inMemoryPersistence } from 'firebase/auth'
import { FIREBASE_CLIENT_CONFIG } from 'assets/env'

const app = initializeClientApp()
export const auth = getAuth(app)
auth.setPersistence(inMemoryPersistence)

export const emailAuthProvider = new EmailAuthProvider()

function initializeClientApp() {
    if (getApps().length > 0) return getApp()
    return initializeApp(FIREBASE_CLIENT_CONFIG)
}
