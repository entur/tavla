import { getApp, getApps, initializeApp } from 'firebase/app'
import {
    EmailAuthProvider,
    connectAuthEmulator,
    getAuth,
    inMemoryPersistence,
} from 'firebase/auth'
import { FIREBASE_CLIENT_CONFIG } from 'assets/env'

const app = initializeClientApp()
export const auth = getAuth(app)

auth.setPersistence(inMemoryPersistence)
if (process.env.NODE_ENV === 'development') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099')
}

export const emailAuthProvider = new EmailAuthProvider()

function initializeClientApp() {
    if (getApps().length > 0) return getApp()
    return initializeApp(FIREBASE_CLIENT_CONFIG)
}
