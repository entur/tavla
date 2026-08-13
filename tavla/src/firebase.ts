import * as Sentry from '@sentry/nextjs'
import { applicationDefault, getApps, initializeApp } from 'firebase-admin'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { type BoardDB, BoardDBSchema } from 'src/types/db-types/boards'
import { type FolderDB, FolderDBSchema } from 'src/types/db-types/folders'
import { logToGcp } from 'utils/logging'

initializeAdminApp()

// getApps/initializeApp/applicationDefault hentes fra pakkeroten, ikke
// 'firebase-admin/app'. Subpath-ene eksporteres via en ESM-shim som Turbopack
// fyller lazily, og denne funksjonen kalles på modulnivå — da er bindingene
// fortsatt undefined. Roten har ingen ESM-betingelse og løses som CJS.
async function initializeAdminApp() {
    if (getApps().length <= 0) {
        initializeApp({
            credential: applicationDefault(),
            projectId: process.env.GOOGLE_PROJECT_ID,
        })
    }
}

export async function getBoard(bid: BoardDB['id']) {
    try {
        const board = await getFirestore().collection('boards').doc(bid).get()
        if (!board.exists) {
            return undefined
        }
        const boardData = {
            id: board.id,
            ...board.data(),
        }
        const parsedBoard = BoardDBSchema.safeParse(boardData)
        if (!parsedBoard.success) {
            logToGcp(
                'debug',
                `Board data validation failed: ${parsedBoard.error}`,
                { bid },
            )
            Sentry.captureMessage(
                'Board data validation failed for board ' + bid,
                {
                    level: 'warning',
                    extra: {
                        error: parsedBoard.error,
                    },
                },
            )
            return boardData as BoardDB
        }
        return parsedBoard.data
    } catch (error) {
        logToGcp('error', `Fetching board from Firebase failed: ${error}`, {
            bid,
        })
        Sentry.captureException(error, {
            level: 'error',
            extra: {
                boardId: bid,
                operation: 'getBoard',
            },
        })
        throw new Error(
            `Failed to fetch board ${bid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            { cause: error },
        )
    }
}

export async function getFolder(folderid: FolderDB['id']) {
    try {
        const folder = await getFirestore()
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
            logToGcp(
                'debug',
                `Folder data validation failed (${parsedFolder.error})`,
                { folderId: folderid },
            )
            Sentry.captureMessage(
                'Folder data validation failed for OID ' + folderid,
                {
                    level: 'warning',
                    extra: {
                        error: parsedFolder.error.flatten(),
                    },
                },
            )
            return folderData as FolderDB
        }
        return parsedFolder.data
    } catch (error) {
        logToGcp('error', `Failed to fetch folder from Firebase: ${error}`, {
            folderId: folderid,
        })
        Sentry.captureException(error, {
            level: 'error',
            extra: {
                folderId: folderid,
                operation: 'getFolder',
            },
        })
        throw new Error(
            `Failed to fetch folder ${folderid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            { cause: error },
        )
    }
}

export async function updateBoard(
    bid: BoardDB['id'],
    data: Record<string, unknown>,
) {
    await getFirestore()
        .collection('boards')
        .doc(bid)
        .update({ ...data, 'meta.dateModified': Date.now() })
}

export async function createBoard(boardData: Omit<BoardDB, 'id'>) {
    const now = Date.now()
    return getFirestore()
        .collection('boards')
        .add({
            ...boardData,
            meta: {
                ...boardData.meta,
                created: now,
                dateModified: now,
            },
        })
}

export async function getBoardByCustomUrl(customUrl: string) {
    try {
        const query = await getFirestore()
            .collection('boards')
            .where('customUrl', '==', customUrl)
            .get()
        if (query.empty || !query.docs[0]) return null

        const boardData = {
            id: query.docs[0].id,
            ...query.docs[0].data(),
        }
        const parsedBoard = BoardDBSchema.safeParse(boardData)
        if (!parsedBoard.success) {
            logToGcp(
                'debug',
                `Board data validation failed (${parsedBoard.error})`,
                { bid: boardData.id },
            )
            Sentry.captureMessage(
                'Board data validation failed for board ' + boardData.id,
                {
                    level: 'warning',
                    extra: {
                        error: parsedBoard.error,
                    },
                },
            )
            return boardData as BoardDB
        }
        return parsedBoard.data
    } catch (error) {
        logToGcp(
            'error',
            `Failed to fetch board with custom url from Firebase: ${error}`,
        )
        Sentry.captureException(error, {
            level: 'error',
            extra: {
                customUrl,
                operation: 'getBoardByCustomUrl',
            },
        })
        throw new Error(
            `Failed to fetch board by custom URL ${customUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            { cause: error },
        )
    }
}

export async function addBoardIdToUser(uid: string, bid: BoardDB['id']) {
    await getFirestore()
        .collection('users')
        .doc(uid)
        .update({ owner: FieldValue.arrayUnion(bid) })
}

export async function removeBoardIdFromUser(uid: string, bid: BoardDB['id']) {
    await getFirestore()
        .collection('users')
        .doc(uid)
        .update({ owner: FieldValue.arrayRemove(bid) })
}

export async function addBoardIdToFolder(
    folderid: FolderDB['id'],
    bid: BoardDB['id'],
) {
    await getFirestore()
        .collection('folders')
        .doc(folderid)
        .update({ boards: FieldValue.arrayUnion(bid) })
}

export async function removeBoardIdFromFolder(
    folderid: FolderDB['id'],
    bid: BoardDB['id'],
) {
    await getFirestore()
        .collection('folders')
        .doc(folderid)
        .update({ boards: FieldValue.arrayRemove(bid) })
}

export async function addOwnerToFolder(folderid: FolderDB['id'], uid: string) {
    await getFirestore()
        .collection('folders')
        .doc(folderid)
        .update({ owners: FieldValue.arrayUnion(uid) })
}

export async function removeOwnerFromFolder(
    folderid: FolderDB['id'],
    uid: string,
) {
    await getFirestore()
        .collection('folders')
        .doc(folderid)
        .update({ owners: FieldValue.arrayRemove(uid) })
}

export async function updateFolder(
    folderid: FolderDB['id'],
    data: Record<string, unknown>,
) {
    await getFirestore().collection('folders').doc(folderid).update(data)
}

export async function createFolder(name: string, uid: string) {
    return getFirestore()
        .collection('folders')
        .add({
            name,
            owners: [uid],
            boards: [],
        })
}

export async function createUser(uid: string) {
    await getFirestore().collection('users').doc(uid).create({})
}

export async function getFolderForBoard(bid: BoardDB['id']) {
    try {
        const ref = await getFirestore()
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
            } else {
                logToGcp(
                    'debug',
                    `Folder data validation failed: ${parsedFolder.error}`,
                    { bid },
                )
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
                return folderData as FolderDB
            }
        })
        return folders[0] ?? null
    } catch (error) {
        logToGcp(
            'error',
            `Failed to fetch folder for board from Firebase: ${error}`,
        )
        Sentry.captureException(error, {
            level: 'error',
            extra: {
                boardId: bid,
                operation: 'getFolderForBoard',
            },
        })
        throw new Error(
            `Failed to fetch folder for board ${bid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            { cause: error },
        )
    }
}
