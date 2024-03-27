'use server'
import admin, { auth, firestore } from 'firebase-admin'
import {
    TBoard,
    TBoardID,
    TOrganization,
    TOrganizationID,
    TUser,
} from 'types/settings'
import { getUserFromSessionCookie } from './server'
import { concat } from 'lodash'
import { getBoardsForOrganization, getOrganization } from '../actions'
import { getFormFeedbackForError } from '.'

initializeAdminApp()

export async function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp()
    }
}

export async function getConfig() {
    const doc = await firestore().collection('config').doc('env').get()
    return doc.data() as { bucket: string }
}

export async function verifySession(session?: string) {
    if (!session) return null
    try {
        return await auth().verifySessionCookie(session, true)
    } catch {
        return null
    }
}

export async function getBoard(bid: TBoardID) {
    const board = await firestore().collection('boards').doc(bid).get()
    return { id: board.id, ...board.data() } as TBoard
}

export async function getOrganizationWithBoard(bid: TBoardID) {
    const ref = await firestore()
        .collection('organizations')
        .where('boards', 'array-contains', bid)
        .get()
    return ref.docs.map((doc) => doc.data() as TOrganization)[0]
}

export async function userCanDeleteBoard(bid: TBoardID) {
    const user = await getUserFromSessionCookie()
    if (!user) return false
    const userDoc = (
        await firestore().collection('users').doc(user.uid).get()
    ).data() as TUser
    if (!userDoc) return false

    const userDeleteAccess = userDoc.owner?.includes(bid)
    if (userDeleteAccess) return true

    const organization = await getOrganizationWithBoard(bid)
    const deleteAccessFromOrganization = concat(
        organization?.owners,
        organization?.editors,
    ).includes(user?.uid)

    return deleteAccessFromOrganization
}

export async function userCanWriteBoard(bid: TBoardID) {
    const user = await getUserFromSessionCookie()
    if (!user) return false
    const writeAccessFromUser = concat(user?.owner, user?.editor).includes(bid)
    if (writeAccessFromUser) return true

    const organization = await getOrganizationWithBoard(bid)
    const writeAccessFromOrganization = concat(
        organization?.owners,
        organization?.editors,
    ).includes(user.uid)

    return writeAccessFromOrganization
}

export async function deleteBoard(bid: TBoardID) {
    const user = await getUserFromSessionCookie()
    const deleteAccess = await userCanDeleteBoard(bid)

    if (!user || !deleteAccess)
        return getFormFeedbackForError('auth/operation-not-allowed')

    return Promise.all([
        firestore().collection('boards').doc(bid).delete(),
        firestore()
            .collection('users')
            .doc(user.uid)
            .update({
                owner: admin.firestore.FieldValue.arrayRemove(bid),
                editor: admin.firestore.FieldValue.arrayRemove(bid),
            }),
    ])
}

export async function deleteOrganization(oid: TOrganizationID) {
    const access = await userCanEditOrganization(oid)
    if (!access) throw 'auth/operation-not-allowed'
    await deleteOrganizationBoards(oid)
    await firestore().collection('organizations').doc(oid).delete()
}

export async function userCanEditOrganization(oid: TOrganizationID) {
    const user = await getUserFromSessionCookie()
    if (!user) return false

    const organization = await getOrganization(oid)
    return organization?.owners?.includes(user.uid) ?? false
}

export async function deleteOrganizationBoards(oid: TOrganizationID) {
    const boards = await getBoardsForOrganization(oid)

    return Promise.all(
        boards
            .filter((board) => board !== undefined)
            .map(
                (board) => board?.id && deleteOrganizationBoard(oid, board.id),
            ),
    )
}

export async function deleteOrganizationBoard(
    oid: TOrganizationID,
    bid: TBoardID,
) {
    const access = await userCanEditOrganization(oid)
    if (!access) throw 'auth/operation-not-allowed'
    return firestore().collection('boards').doc(bid).delete()
}
