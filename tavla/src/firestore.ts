import * as Sentry from '@sentry/nextjs'
import { FieldValue } from 'firebase-admin/firestore'
import { type BoardDB, BoardDBSchema } from 'src/types/db-types/boards'
import { type FolderDB, FolderDBSchema } from 'src/types/db-types/folders'
import { logToGcp } from 'utils/logging'
import { adminDb } from './firebaseAdmin'

export async function getBoard(bid: BoardDB['id']) {
    try {
        const board = await adminDb().collection('boards').doc(bid).get()
        if (!board.exists) {
            return undefined
        }
        const boardData = {
            id: board.id,
            ...board.data(),
        }
        const parsedBoard = BoardDBSchema.safeParse(boardData)
        if (!parsedBoard.success) {
            logToGcp('warning', 'board data validation failed', {
                type: 'firestore',
                bid,
                errorMessage: parsedBoard.error.message,
            })
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
        logToGcp('error', 'fetching board from firebase failed', {
            type: 'firestore',
            bid,
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
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
        const folder = await adminDb().collection('folders').doc(folderid).get()
        if (!folder.exists) {
            return undefined
        }
        const folderData = {
            id: folder.id,
            ...folder.data(),
        }
        const parsedFolder = FolderDBSchema.safeParse(folderData)
        if (!parsedFolder.success) {
            logToGcp('warning', 'folder data validation failed', {
                type: 'firestore',
                folderId: folderid,
                errorMessage: parsedFolder.error.message,
            })
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
        logToGcp('error', 'fetching folder from firebase failed', {
            type: 'firestore',
            folderId: folderid,
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
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
    await adminDb()
        .collection('boards')
        .doc(bid)
        .update({ ...data, 'meta.dateModified': Date.now() })
}

export async function createBoard(boardData: Omit<BoardDB, 'id'>) {
    const now = Date.now()
    return adminDb()
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
        const query = await adminDb()
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
            logToGcp('warning', 'board data validation failed', {
                type: 'firestore',
                bid: boardData.id,
                errorMessage: parsedBoard.error.message,
            })
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
        logToGcp('error', 'fetching board by custom url from firebase failed', {
            type: 'firestore',
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
            context: { customUrl },
        })
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
    await adminDb()
        .collection('users')
        .doc(uid)
        .update({ owner: FieldValue.arrayUnion(bid) })
}

export async function removeBoardIdFromUser(uid: string, bid: BoardDB['id']) {
    await adminDb()
        .collection('users')
        .doc(uid)
        .update({ owner: FieldValue.arrayRemove(bid) })
}

export async function addBoardIdToFolder(
    folderid: FolderDB['id'],
    bid: BoardDB['id'],
) {
    await adminDb()
        .collection('folders')
        .doc(folderid)
        .update({ boards: FieldValue.arrayUnion(bid) })
}

export async function removeBoardIdFromFolder(
    folderid: FolderDB['id'],
    bid: BoardDB['id'],
) {
    await adminDb()
        .collection('folders')
        .doc(folderid)
        .update({ boards: FieldValue.arrayRemove(bid) })
}

export async function addOwnerToFolder(folderid: FolderDB['id'], uid: string) {
    await adminDb()
        .collection('folders')
        .doc(folderid)
        .update({ owners: FieldValue.arrayUnion(uid) })
}

export async function removeOwnerFromFolder(
    folderid: FolderDB['id'],
    uid: string,
) {
    await adminDb()
        .collection('folders')
        .doc(folderid)
        .update({ owners: FieldValue.arrayRemove(uid) })
}

export async function updateFolder(
    folderid: FolderDB['id'],
    data: Record<string, unknown>,
) {
    await adminDb().collection('folders').doc(folderid).update(data)
}

export async function createFolder(name: string, uid: string) {
    return adminDb()
        .collection('folders')
        .add({
            name,
            owners: [uid],
            boards: [],
        })
}

export async function createUser(uid: string) {
    await adminDb().collection('users').doc(uid).create({})
}

export async function getFolderForBoard(bid: BoardDB['id']) {
    try {
        const ref = await adminDb()
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
                logToGcp('warning', 'folder data validation failed', {
                    type: 'firestore',
                    bid,
                    folderId: doc.id,
                    errorMessage: parsedFolder.error.message,
                })
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
        logToGcp('error', 'fetching folder for board from firebase failed', {
            type: 'firestore',
            bid,
            errorName: error instanceof Error ? error.name : undefined,
            errorMessage:
                error instanceof Error ? error.message : String(error),
        })
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
