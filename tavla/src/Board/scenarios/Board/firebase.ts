import { makeBoardCompatible } from 'app/(admin)/tavler/[id]/rediger/compatibility'
import admin, { firestore } from 'firebase-admin'
import { TBoard, TBoardID, TFolder, TFolderID } from 'types/settings'
import * as Sentry from '@sentry/nextjs'

initializeAdminApp()

async function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.GOOGLE_PROJECT_ID,
        })
    }
}

export async function getBoard(bid: TBoardID) {
    try {
        const board = await firestore().collection('boards').doc(bid).get()
        if (!board.exists) {
            return undefined
        }
        return makeBoardCompatible({ id: board.id, ...board.data() } as TBoard)
    } catch (error) {
        Sentry.captureMessage('Failed to fetch board with bid ' + bid)
        throw error
    }
}

export async function getFolder(oid: TFolderID) {
    try {
        const folder = await firestore().collection('folders').doc(oid).get()
        if (!folder.exists) {
            return undefined
        }
        return { id: folder.id, ...folder.data() } as TFolder
    } catch (error) {
        Sentry.captureMessage('Failed to fetch folder with OID ' + oid)
        throw error
    }
}

export async function getFolderForBoard(bid: TBoardID) {
    try {
        const ref = await firestore()
            .collection('folders')
            .where('boards', 'array-contains', bid)
            .get()
        const folder = ref.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as TFolder,
        )
        return folder[0] ?? null
    } catch (error) {
        Sentry.captureMessage('Failed to fetch folder with board ' + bid)
        throw error
    }
}
