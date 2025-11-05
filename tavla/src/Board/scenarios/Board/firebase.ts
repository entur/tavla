import * as Sentry from '@sentry/nextjs'
import { makeBoardCompatible } from 'app/(admin)/tavler/[id]/rediger/compatibility'
import admin, { firestore } from 'firebase-admin'
import { BoardDB, BoardId } from 'types/db-types/boards'
import { FolderDB, FolderId } from 'types/db-types/folders'

initializeAdminApp()

async function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.GOOGLE_PROJECT_ID,
        })
    }
}

export async function getBoard(bid: BoardId) {
    try {
        const board = await firestore().collection('boards').doc(bid).get()
        if (!board.exists) {
            return undefined
        }
        return makeBoardCompatible({ id: board.id, ...board.data() } as BoardDB)
    } catch (error) {
        Sentry.captureMessage('Failed to fetch board with bid ' + bid)
        throw error
    }
}

export async function getFolder(folderid: FolderId) {
    try {
        const folder = await firestore()
            .collection('folders')
            .doc(folderid)
            .get()
        if (!folder.exists) {
            return undefined
        }
        return { id: folder.id, ...folder.data() } as FolderDB
    } catch (error) {
        Sentry.captureMessage('Failed to fetch folder with OID ' + folderid)
        throw error
    }
}

export async function getFolderForBoard(bid: BoardId) {
    try {
        const ref = await firestore()
            .collection('folders')
            .where('boards', 'array-contains', bid)
            .get()
        const folder = ref.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as FolderDB,
        )
        return folder[0] ?? null
    } catch (error) {
        Sentry.captureMessage('Failed to fetch folder with board ' + bid)
        throw error
    }
}
