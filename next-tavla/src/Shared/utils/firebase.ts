import { TSettings } from 'types/settings'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { EmailAuthProvider, getAuth } from 'firebase/auth'
import {
    getDoc,
    addDoc,
    setDoc,
    deleteDoc,
    doc,
    collection,
    getFirestore,
} from '@firebase/firestore/lite'
import { FIREBASE_CLIENT_CONFIG } from 'assets/env'
import { upgradeSettings } from './converters'

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

export async function deleteBoard(boardId: string) {
    const firestore = safeGetFirestore()
    const docRef = doc(firestore, 'settings-v2', boardId)
    await deleteDoc(docRef)
}

export async function getBoards() {
    //when login is fixed:
    // 1. take user id as params
    // 2. create getBoards function in firebase.ts that gets all boards for a user based on user id
    // 3. use getBoards function instead of getBoardSettings to get all boards for a user
    // 4. remove ids const
    const ids = [
        'Malre1Dx5zLE086AzpFH',
        'oMgfeCRUZ4sfD8xXXG8M',
        '8EyKHHP5Ie2HisOO2ilt',
    ]

    const settingsPromises = ids.map(async (id: string) => {
        const settings = await getBoardSettings(id)
        return { id, settings }
    })

    const allSettingsWithIds = await Promise.all(settingsPromises)

    const convertedSettings = allSettingsWithIds.map(({ id, settings }) => {
        return {
            id,
            settings: settings ? upgradeSettings(settings) : null,
        }
    })

    return convertedSettings
}
