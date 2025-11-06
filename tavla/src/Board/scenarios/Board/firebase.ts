import * as Sentry from '@sentry/nextjs'
import { makeBoardCompatible } from 'app/(admin)/tavler/[id]/rediger/compatibility'
import admin, { firestore } from 'firebase-admin'
import { BoardDB, BoardDBSchema } from 'types/db-types/boards'
import { FolderDB, FolderDBSchema } from 'types/db-types/folders'

initializeAdminApp()

async function initializeAdminApp() {
    if (admin.apps.length <= 0) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.GOOGLE_PROJECT_ID,
        })
    }
}

export async function getBoard(bid: BoardDB['id']) {
    try {
        const board = await firestore().collection('boards').doc(bid).get()
        if (!board.exists) {
            return undefined
        }
        const boardData = {
            id: board.id,
            ...board.data(),
        }
        const parsedBoard = BoardDBSchema.safeParse(boardData)
        if (!parsedBoard.success) {
            Sentry.captureMessage(
                'Board data validation failed for board ' + bid,
                {
                    level: 'warning',
                    extra: {
                        error: parsedBoard.error,
                    },
                },
            )
            return undefined
        }
        return makeBoardCompatible(parsedBoard.data)
    } catch (error) {
        Sentry.captureMessage('Failed to fetch board with bid ' + bid)
        throw error
    }
}

export async function getFolder(folderid: FolderDB['id']) {
    try {
        const folder = await firestore()
            .collection('folders')
            .doc(folderid)
            .get()
        if (!folder.exists) {
            return undefined
        }
        const folderData = {
            id: folder.id,
            ...folder.data(),
        }
        const parsedFolder = FolderDBSchema.safeParse(folderData)
        if (!parsedFolder.success) {
            Sentry.captureMessage(
                'Folder data validation failed for OID ' + folderid,
                {
                    level: 'warning',
                    extra: {
                        error: parsedFolder.error.flatten(),
                    },
                },
            )
            return undefined
        }
        return parsedFolder.data
    } catch (error) {
        Sentry.captureMessage('Failed to fetch folder with OID ' + folderid)
        throw error
    }
}

export async function getFolderForBoard(bid: BoardDB['id']) {
    try {
        const ref = await firestore()
            .collection('folders')
            .where('boards', 'array-contains', bid)
            .get()
        const folders = ref.docs.map((doc) => {
            const folderData = {
                id: doc.id,
                ...doc.data(),
            }
            const parsedFolder = FolderDBSchema.safeParse(folderData)
            if (parsedFolder.success) {
                return parsedFolder.data
            }
            Sentry.captureMessage(
                'Folder data validation failed for board ' + bid,
                {
                    level: 'warning',
                    extra: {
                        error: parsedFolder.error,
                        folderId: doc.id,
                    },
                },
            )
        })
        return folders[0] ?? null
    } catch (error) {
        Sentry.captureMessage('Failed to fetch folder with board ' + bid)
        throw error
    }
}
