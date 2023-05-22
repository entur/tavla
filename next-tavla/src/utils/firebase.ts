import { TSettings } from 'types/settings'
import { initializeApp } from 'firebase/app'
import {
    getDoc,
    addDoc,
    setDoc,
    doc,
    collection,
    getFirestore,
} from '@firebase/firestore/lite'
import { firebaseConfig } from 'assets/environmentConfig'

const app = initializeApp(firebaseConfig)

const firestore = getFirestore(app)

export async function getBoardSettings(boardId: string) {
    const document = await getDoc(doc(firestore, 'settings-v2', boardId))
    return document.data() as TSettings
}

export async function setBoardSettings(boardId: string, settings: TSettings) {
    const docRef = doc(firestore, 'settings-v2', boardId)
    await setDoc(docRef, settings)
}

export async function addBoardSettings(settings: TSettings) {
    await addDoc(collection(firestore, 'settings-v2'), settings)
}
