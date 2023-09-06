import { TBoard, TUser, TUserID } from 'types/settings'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { EmailAuthProvider, getAuth, Persistence } from 'firebase/auth'
import {
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    doc,
    query,
    where,
    collection,
    getFirestore,
} from '@firebase/firestore/lite'
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

// export async function setBoard(boardId: string, settings: TBoard) {
//     const docRef = doc(firestore, 'boards', boardId)

//     // Remove id field (inherent attribute not needed in firestore)
//     delete settings.id

//     // Removes explicitly assigned undefined properties on settings
//     const sanitizedSettings = JSON.parse(JSON.stringify(settings))

//     await setDoc(docRef, sanitizedSettings)
// }

// export async function addBoard(settings: TBoard) {
//     return await addDoc(collection(firestore, 'boards'), settings)
// }

// export async function getBoardsForUser(userId: TUserID) {
//     const user = (await getDoc(doc(firestore, 'users', userId))).data() as TUser

//     const boardIDs = user.owner?.concat(user.editor ?? []) // Combine owner and editor

//     const boardsQuery = query(
//         collection(firestore, 'boards'),
//         where('Document ID', 'in', boardIDs),
//     )

//     const boards = await getDocs(boardsQuery)

//     return boards.docs.map(
//         (board) => ({ id: board.id, ...board.data() } as TBoard),
//     )
// }
