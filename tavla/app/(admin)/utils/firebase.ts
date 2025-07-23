'use server'
import * as Sentry from '@sentry/nextjs'
import { getFolderForBoard } from 'Board/scenarios/Board/firebase'
import admin, { auth, firestore } from 'firebase-admin'
import { TBoardID, TFolderID, TUser } from 'types/settings'
import { getBoardsForFolder, getFolderIfUserHasAccess } from '../actions'
import { getUserFromSessionCookie } from './server'

initializeAdminApp()

export async function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.GOOGLE_PROJECT_ID,
        })
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

export async function revokeUserTokenOnLogout() {
    const user = await getUserFromSessionCookie()
    if (!user || !user.uid) {
        return null
    }
    try {
        await auth().revokeRefreshTokens(user.uid)
    } catch {
        return null
    }
}

export async function getUserWithBoardIds() {
    const user = await getUserFromSessionCookie()
    if (!user) return null
    const userDoc = await firestore().collection('users').doc(user.uid).get()
    return { ...userDoc.data(), uid: userDoc.id } as TUser
}

export async function userCanEditBoard(bid?: TBoardID) {
    if (!bid) return false

    const user = await getUserWithBoardIds()
    const userEditorAccess = user && user.owner?.includes(bid)

    if (user?.uid && !userEditorAccess) {
        const folder = await getFolderForBoard(bid)
        return folder && folder.owners?.includes(user.uid)
    }
    return userEditorAccess
}

export async function deleteBoard(bid: TBoardID) {
    const user = await getUserFromSessionCookie()
    const access = await userCanEditBoard(bid)

    if (!user || !access) throw 'auth/operation-not-allowed'

    const folder = await getFolderForBoard(bid)

    try {
        await firestore().collection('boards').doc(bid).delete()

        if (folder?.id) {
            await firestore()
                .collection('folders')
                .doc(folder.id)
                .update({
                    boards: admin.firestore.FieldValue.arrayRemove(bid),
                })
        } else {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    owner: admin.firestore.FieldValue.arrayRemove(bid),
                })
        }
    } catch (error) {
        Sentry.captureMessage('Failed to delete board with id: ' + bid)
        throw error
    }
}

export async function deleteFolder(oid: TFolderID) {
    const access = await userCanEditFolder(oid)
    if (!access) throw 'auth/operation-not-allowed'
    await deleteFolderBoards(oid)
    await firestore().collection('folders').doc(oid).delete()
}

export async function userCanEditFolder(oid: TFolderID) {
    const user = await getUserFromSessionCookie()
    if (!user) return false

    const folder = await getFolderIfUserHasAccess(oid)
    if (!folder) return false
    return true
}

export async function deleteFolderBoards(oid: TFolderID) {
    const boards = await getBoardsForFolder(oid)

    return Promise.all(
        boards
            .filter((board) => board !== undefined)
            .map((board) => board?.id && deleteFolderBoard(oid, board.id)),
    )
}

export async function deleteFolderBoard(oid: TFolderID, bid: TBoardID) {
    const access = await userCanEditFolder(oid)
    if (!access) throw 'auth/operation-not-allowed'
    try {
        return firestore().collection('boards').doc(bid).delete()
    } catch (error) {
        Sentry.captureMessage(
            'Erorr while deleting board ' + bid + ' in folder ' + oid,
        )
        throw error
    }
}

export async function removeUserFromFolder(oid: string, uid: string) {
    try {
        await firestore()
            .collection('folders')
            .doc(oid)
            .update({
                owners: admin.firestore.FieldValue.arrayRemove(uid),
            })
    } catch (error) {
        Sentry.captureMessage(
            'Error while removing user ' + uid + ' from folder ' + oid,
        )
        throw error
    }
}

export async function deleteUserFromFirebaseAuth() {
    const user = await getUserFromSessionCookie()
    if (!user || !user.uid) {
        return
    }
    try {
        await auth().deleteUser(user.uid)
    } catch (error) {
        Sentry.captureMessage(
            'Error while deleting user ' + user?.uid + ' from firebase auth',
        )
        throw error
    }
}

export async function deleteUserFromFirestore() {
    const user = await getUserFromSessionCookie()
    if (!user || !user.uid) {
        return
    }
    try {
        await firestore().collection('users').doc(user.uid).delete()
    } catch (error) {
        Sentry.captureMessage(
            'Error while deleting user ' + user?.uid + ' from firestore',
        )
        throw error
    }
}
