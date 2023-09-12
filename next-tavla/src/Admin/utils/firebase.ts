import { TavlaError } from 'Admin/types/error'
import admin, { auth, firestore } from 'firebase-admin'
import { cert } from 'firebase-admin/app'
import { concat } from 'lodash'
import { TBoard, TBoardID, TOrganization, TUser, TUserID } from 'types/settings'

initializeAdminApp()

export function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp({
            credential: cert(JSON.parse(process.env.SERVICE_ACCOUNT ?? '')),
        })
    }
}

export async function createUser(uid: TUserID) {
    return await firestore().collection('users').doc(uid).create({})
}

export async function verifySession(session?: string) {
    if (!session) return null
    try {
        return await auth().verifySessionCookie(session, true)
    } catch {
        return null
    }
}

export async function getBoardsForUser(uid: TUserID) {
    const user = (
        await firestore().collection('users').doc(uid).get()
    ).data() as TUser

    if (!user)
        throw new TavlaError({
            code: 'NOT_FOUND',
            message: `Found no user with id ${uid}`,
        })

    const boardIDs = concat(user?.owner ?? [], user?.editor ?? [])
    const boardRefs = await firestore()
        .collection('boards')
        .where(firestore.FieldPath.documentId(), 'in', boardIDs)
        .get()
    const boards = boardRefs.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as TBoard),
    )
    return boards
}

export async function setBoard(board: TBoard, uid: TUserID) {
    if (!board.id)
        throw new TavlaError({
            code: 'BOARD',
            message: 'No BoardID was provided.',
        })
    const writeAccess = await userCanWriteBoard(uid, board.id)
    if (!writeAccess)
        throw new TavlaError({
            code: 'BOARD',
            message: 'User does not have access to this board.',
        })

    const boardId = board.id

    // Remove uneccesary id field before storing
    delete board.id

    // Sanitize object by removing explicitly assigned undefined properties
    const sanitizedBoard = JSON.parse(JSON.stringify(board))

    return await firestore()
        .collection('boards')
        .doc(boardId)
        .set(sanitizedBoard)
}

export async function createBoard(uid: TUserID) {
    const board = await firestore().collection('boards').add({ tiles: [] })
    firestore()
        .collection('users')
        .doc(uid)
        .update({
            owner: admin.firestore.FieldValue.arrayUnion(board.id),
        })
    return board.id
}

export async function userCanWriteBoard(uid: TUserID, bid: TBoardID) {
    const user = await getUser(uid)
    const writeAccessFromUser = concat(user?.owner, user?.editor).includes(bid)
    if (writeAccessFromUser) return true

    const organization = await getOrganizationWithBoard(bid)
    const writeAccessFromOrganization = concat(
        organization?.owners,
        organization?.editors,
    ).includes(uid)

    return writeAccessFromOrganization
}

export async function getUser(uid: TUserID) {
    const doc = await firestore().collection('users').doc(uid).get()
    return doc.data() as TUser
}

export async function getOrganizationWithBoard(bid: TBoardID) {
    const ref = await firestore()
        .collection('organizations')
        .where('boards', 'array-contains', bid)
        .get()
    return ref.docs.map((doc) => doc.data() as TOrganization)[0]
}
