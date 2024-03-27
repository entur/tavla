import { getApp, getApps, initializeApp } from 'firebase/app'
import {
    connectAuthEmulator,
    getAuth,
    inMemoryPersistence,
} from 'firebase/auth'
import { getFirebaseClientConfig } from 'app/(admin)/actions'
import { FIREBASE_DEV_CONFIG } from 'app/(admin)/utils/constants'

if (process.env.NODE_ENV === 'development') {
    const app = initializeApp(FIREBASE_DEV_CONFIG)
    const auth = getAuth(app)
    auth.setPersistence(inMemoryPersistence)
    connectAuthEmulator(auth, 'http://127.0.0.1:9099')
}

export async function getClientApp() {
    if (getApps().length > 0) return getApp()
    return initializeApp(await getFirebaseClientConfig())
}
