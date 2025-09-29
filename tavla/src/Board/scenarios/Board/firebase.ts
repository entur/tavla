import * as Sentry from '@sentry/nextjs'
import { makeBoardCompatible } from 'app/(admin)/tavler/[id]/rediger/compatibility'
import admin, { firestore } from 'firebase-admin'
import { TBoard, TBoardID, TFolder, TFolderID } from 'types/settings'

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
        return makeBoardCompatible(
            convertTimestamps({ id: board.id, ...board.data() }) as TBoard,
        )
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
        return convertTimestamps({ id: folder.id, ...folder.data() }) as TFolder
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
            (doc) =>
                convertTimestamps({ id: doc.id, ...doc.data() }) as TFolder,
        )
        return folder[0] ?? null
    } catch (error) {
        Sentry.captureMessage('Failed to fetch folder with board ' + bid)
        throw error
    }
}
