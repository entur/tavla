import { TBoard } from 'types/settings'
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
import { upgradeBoard } from './converters'

const app = initializeClientApp()
export const auth = getAuth(app)
export const firestore = getFirestore(app)

export const emailAuthProvider = new EmailAuthProvider()

function initializeClientApp() {
    if (getApps().length > 0) return getApp()
    return initializeApp(FIREBASE_CLIENT_CONFIG)
}

export async function getBoard(boardId: string) {
    const document = await getDoc(doc(firestore, 'boards', boardId))
    return { id: document.id, ...document.data() } as TBoard
}

export async function setBoard(boardId: string, settings: TBoard) {
    const docRef = doc(firestore, 'boards', boardId)

    // Remove id field (inherent attribute not needed in firestore)
    delete settings.id

    // Removes explicitly assigned undefined properties on settings
    const sanitizedSettings = JSON.parse(JSON.stringify(settings))

    await setDoc(docRef, sanitizedSettings)
}

export async function addBoard(settings: TBoard) {
    return await addDoc(collection(firestore, 'boards'), settings)
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
            settings: settings ? upgradeBoard(settings) : null,
        }
    })

    return convertedSettings
}
