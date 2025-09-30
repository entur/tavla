'use server'
import * as Sentry from '@sentry/nextjs'
import { Folder } from 'app/(admin)/utils/types'
import { firestore } from 'firebase-admin'
import { chunk, isEmpty } from 'lodash'
import { redirect } from 'next/navigation'
import { TBoard, TBoardID, TFolder, TFolderID, TUserID } from 'types/settings'
import { FIREBASE_DEV_CONFIG, FIREBASE_PRD_CONFIG } from './utils/constants'
import { getUserWithBoardIds, initializeAdminApp } from './utils/firebase'
import { getUserFromSessionCookie } from './utils/server'

initializeAdminApp()

// Convert Firestore Timestamp objects to milliseconds for serialization
function convertTimestamps<T>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj

    // Handle Firestore Timestamp format
    if (
        typeof obj === 'object' &&
        obj !== null &&
        '_seconds' in obj &&
        '_nanoseconds' in obj
    ) {
        const timestamp = obj as { _seconds: number; _nanoseconds: number }
        return (timestamp._seconds * 1000 +
            Math.floor(timestamp._nanoseconds / 1000000)) as T
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map((item) => convertTimestamps(item)) as T
    }

    // Handle regular objects
    if (obj.constructor === Object) {
        const converted: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj)) {
            converted[key] = convertTimestamps(value)
        }
        return converted as T
    }

    return obj
}

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
        if (!doc) throw Error('Fetch folders returned null or undefined')
    } catch (error) {
        Sentry.captureMessage(
            'Error while fetching folders from firestore, folderID: ' + oid,
        )
        throw error
    }

    const folder = convertTimestamps({ ...doc.data(), id: doc.id }) as TFolder
    const user = await getUserFromSessionCookie()

    if (!userInFolder(user?.uid, folder)) return redirect('/')
    return folder
}

export async function getFoldersForUser(): Promise<Folder[]> {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    try {
        const owner = firestore()
            .collection('folders')
            .where('owners', 'array-contains', user.uid)
            .get()

        const queries = await Promise.all([owner])
        const folders = queries
            .map((q) =>
                q.docs.map(
                    (d) =>
                        convertTimestamps({ ...d.data(), id: d.id }) as TFolder,
                ),
            )
            .flat()

        // Get all boards-IDS for all folders
        const allBoardIds = folders
            .flatMap((folder) => folder.boards || [])
            .filter(Boolean)

        if (allBoardIds.length === 0) {
            return folders.map((folder) => ({
                ...folder,
                lastUpdated: undefined,
                boardCount: folder.boards?.length || 0,
            }))
        }

        const allBoards = await getBoards(allBoardIds)

        // Calcualte lastUpdated for each folder
        return folders.map((folder) => {
            if (!folder.id || !folder.boards?.length) {
                return { ...folder, lastUpdated: undefined, boardCount: 0 }
            }

            const folderBoards = allBoards.filter(
                (board) => board.id && folder.boards?.includes(board.id),
            )

            const lastUpdated = Math.max(
                0,
                ...folderBoards.map((board) => board.meta?.dateModified || 0),
            )

            return {
                ...folder,
                lastUpdated: lastUpdated > 0 ? lastUpdated : undefined,
                boardCount: folderBoards.length || 0,
            }
        })
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
                    (doc) =>
                        convertTimestamps({
                            id: doc.id,
                            ...doc.data(),
                        }) as TBoard,
                ),
            )
            .flat()
    } catch (error) {
        Sentry.captureMessage(
            'Error while fetching boards for folder with folderID ' + oid,
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
                    (doc) =>
                        convertTimestamps({
                            id: doc.id,
                            ...doc.data(),
                        }) as TBoard,
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
