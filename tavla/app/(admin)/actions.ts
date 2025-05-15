'use server'
import { firestore } from 'firebase-admin'
import { TFolderID, TFolder, TBoard, TBoardID, TUserID } from 'types/settings'
import { getUserWithBoardIds, initializeAdminApp } from './utils/firebase'
import { getUserFromSessionCookie } from './utils/server'
import { chunk, isEmpty } from 'lodash'
import { redirect } from 'next/navigation'
import { FIREBASE_DEV_CONFIG, FIREBASE_PRD_CONFIG } from './utils/constants'
import * as Sentry from '@sentry/nextjs'

initializeAdminApp()

export async function getFirebaseClientConfig() {
    const env = process.env.GOOGLE_PROJECT_ID
    if (env === 'ent-tavla-prd') return FIREBASE_PRD_CONFIG
    return FIREBASE_DEV_CONFIG
}

function userInFolder(uid?: TUserID, folder?: TFolder) {
    return uid && folder && folder.owners?.includes(uid)
}

export async function getFolderIfUserHasAccess(oid?: TFolderID) {
    if (!oid) return undefined

    let doc = null

    try {
        doc = await firestore().collection('folders').doc(oid).get()
        if (!doc) throw Error('Fetch org returned null or undefined')
    } catch (error) {
        Sentry.captureMessage(
            'Error while fetching folder from firestore, orgID: ' + oid,
        )
        throw error
    }

    const folder = { ...doc.data(), id: doc.id } as TFolder
    const user = await getUserFromSessionCookie()

    if (!userInFolder(user?.uid, folder)) return redirect('/')
    return folder
}

export async function getFoldersForUser() {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    try {
        const owner = firestore()
            .collection('folders')
            .where('owners', 'array-contains', user.uid)
            .get()

        const queries = await Promise.all([owner])
        return queries
            .map((q) =>
                q.docs.map((d) => ({ ...d.data(), id: d.id }) as TFolder),
            )
            .flat()
    } catch (error) {
        Sentry.captureMessage(
            'Error while fetching folders for user with id ' + user.uid,
        )
        throw error
    }
}

export async function getBoardsForFolder(oid: TFolderID) {
    const folder = await getFolderIfUserHasAccess(oid)
    if (!folder) return redirect('/')

    const boards = folder.boards
    if (isEmpty(boards)) return []

    const batchedBoardIDs = chunk(boards, 20)

    try {
        const boardQueries = batchedBoardIDs.map((batch) =>
            firestore()
                .collection('boards')
                .where(firestore.FieldPath.documentId(), 'in', batch)
                .get(),
        )

        const boardRefs = await Promise.all(boardQueries)

        return boardRefs
            .map((ref) =>
                ref.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() }) as TBoard,
                ),
            )
            .flat()
    } catch (error) {
        Sentry.captureMessage(
            'Error while fetching boards for folder with orgID ' + oid,
        )
        throw error
    }
}

export async function getBoards(ids?: TBoardID[]) {
    if (!ids) return []

    const batches = chunk(ids, 20)
    try {
        const queries = batches.map((batch) =>
            firestore()
                .collection('boards')
                .where(firestore.FieldPath.documentId(), 'in', batch)
                .get(),
        )

        const refs = await Promise.all(queries)
        return refs
            .map((ref) =>
                ref.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() }) as TBoard,
                ),
            )
            .flat()
    } catch (error) {
        Sentry.captureMessage('Error while fetching list of boards: ' + ids)
        throw error
    }
}

export async function getPrivateBoardsForUser() {
    const userWithBoards = await getUserWithBoardIds()
    const privateBoards = await getBoards(userWithBoards?.owner as TBoardID[])

    return privateBoards
}
