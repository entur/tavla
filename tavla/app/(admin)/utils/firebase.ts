'use server'
import * as Sentry from '@sentry/nextjs'
import { getFolderForBoard } from 'Board/scenarios/Board/firebase'
import admin, { auth, firestore } from 'firebase-admin'
import { BoardDB } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'
import { UserDB, UserDBSchema } from 'types/db-types/users'
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

export async function getUserWithBoardIds(): Promise<UserDB | null> {
    const user = await getUserFromSessionCookie()
    if (!user) return null
    const userDoc = await firestore().collection('users').doc(user.uid).get()
    const userData = {
        uid: userDoc.id,
        ...userDoc.data(),
    }
    const parsedUser = UserDBSchema.safeParse(userData)
    if (!parsedUser.success) {
        Sentry.captureMessage(
            'User data validation failed for user:' + userDoc.id,
            {
                level: 'warning',
                extra: {
                    error: parsedUser.error,
                },
            },
        )
        return null
    }
    return parsedUser.data
}

export async function userCanEditBoard(bid?: BoardDB['id']) {
    if (!bid) return false

    const user = await getUserWithBoardIds()
    const userEditorAccess = user && user.owner?.includes(bid)

    if (user?.uid && !userEditorAccess) {
        const folder = await getFolderForBoard(bid)
        return folder && folder.owners?.includes(user.uid)
    }
    return userEditorAccess
}

export async function deleteBoard(bid: BoardDB['id']) {
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

export async function deleteFolder(folderid: FolderDB['id']) {
    const access = await userCanEditFolder(folderid)
    if (!access) throw 'auth/operation-not-allowed'
    await deleteFolderBoards(folderid)
    await firestore().collection('folders').doc(folderid).delete()
}

export async function userCanEditFolder(folderid: FolderDB['id']) {
    const user = await getUserFromSessionCookie()
    if (!user) return false

    const folder = await getFolderIfUserHasAccess(folderid)
    if (!folder) return false
    return true
}

export async function deleteFolderBoards(folderid: FolderDB['id']) {
    const boards = await getBoardsForFolder(folderid)

    return Promise.all(
        boards
            .filter((board) => board !== undefined)
            .map((board) => board?.id && deleteFolderBoard(folderid, board.id)),
    )
}

export async function deleteFolderBoard(
    folderid: FolderDB['id'],
    bid: BoardDB['id'],
) {
    const access = await userCanEditFolder(folderid)
    if (!access) throw 'auth/operation-not-allowed'
    try {
        return firestore().collection('boards').doc(bid).delete()
    } catch (error) {
        Sentry.captureMessage(
            'Erorr while deleting board ' + bid + ' in folder ' + folderid,
        )
        throw error
    }
}

export async function removeUserFromFolder(folderid: string, uid: string) {
    try {
        await firestore()
            .collection('folders')
            .doc(folderid)
            .update({
                owners: admin.firestore.FieldValue.arrayRemove(uid),
            })
    } catch (error) {
        Sentry.captureMessage(
            'Error while removing user ' + uid + ' from folder ' + folderid,
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
