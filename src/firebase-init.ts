import firebase from 'firebase/compat/app'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

if (!process.env.FIREBASE_CONFIG) {
    // eslint-disable-next-line no-console
    console.error('The environment variable FIREBASE_CONFIG is missing!')
} else {
    const app = firebase.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG))
    if (process.env.FIREBASE_ENV === 'local') {
        const auth = getAuth(app)
        const functions = getFunctions(app)
        const firestore = getFirestore(app)
        const storage = getStorage(app)
        connectAuthEmulator(auth, 'http://localhost:9099')
        connectFunctionsEmulator(functions, 'localhost', 5001)
        connectFirestoreEmulator(firestore, 'localhost', 8080)
        connectStorageEmulator(storage, 'localhost', 9199)
    }
}
