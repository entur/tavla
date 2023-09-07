import { TBoard, TUser, TUserID } from 'types/settings'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { EmailAuthProvider, getAuth, Persistence } from 'firebase/auth'
import { getDoc, doc, getFirestore } from '@firebase/firestore/lite'
import { FIREBASE_CLIENT_CONFIG } from 'assets/env'

const app = initializeClientApp()
export const auth = getAuth(app)
auth.setPersistence('NONE' as unknown as Persistence)
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
