import { initializeApp } from 'firebase/app'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

if (!process.env.FIREBASE_CONFIG)
    // eslint-disable-next-line no-console
    console.error('The environment variable FIREBASE_CONFIG is missing!')

const firebaseConfig = process.env.FIREBASE_CONFIG
    ? JSON.parse(process.env.FIREBASE_CONFIG)
    : {}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const functions = getFunctions(firebaseApp, 'europe-west3')
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
if (process.env.FIREBASE_ENV === 'local') {
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectFunctionsEmulator(functions, 'localhost', 5001)
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectStorageEmulator(storage, 'localhost', 9199)
}
