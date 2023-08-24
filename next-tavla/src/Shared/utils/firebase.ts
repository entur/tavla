import { TSettings } from 'types/settings'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { EmailAuthProvider, getAuth } from 'firebase/auth'
import {
    getDoc,
    addDoc,
    setDoc,
    doc,
    collection,
    getFirestore,
} from '@firebase/firestore/lite'
import { FIREBASE_CLIENT_CONFIG } from 'assets/env'

const app = initializeClientApp()
export const auth = getAuth(app)

export const emailAuthProvider = new EmailAuthProvider()

function initializeClientApp() {
    if (getApps().length > 0) return getApp()
    return initializeApp(FIREBASE_CLIENT_CONFIG)
}

function safeGetFirestore() {
    const app = initializeClientApp()
    return getFirestore(app)
}

export async function getBoardSettings(boardId: string) {
    const firestore = safeGetFirestore()
    const document = await getDoc(doc(firestore, 'settings-v2', boardId))
    return document.data() as TSettings
}

export async function setBoardSettings(boardId: string, settings: TSettings) {
    const firestore = safeGetFirestore()
    const docRef = doc(firestore, 'settings-v2', boardId)
    // Removes explicitly assigned undefined properties on settings
    const sanitizedSettings = JSON.parse(JSON.stringify(settings))
    await setDoc(docRef, sanitizedSettings)
}

export async function addBoardSettings(settings: TSettings) {
    const firestore = safeGetFirestore()
    return await addDoc(collection(firestore, 'settings-v2'), settings)
}
