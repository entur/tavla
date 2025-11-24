'use server'
import * as Sentry from '@sentry/nextjs'
import { Folder } from 'app/(admin)/utils/types'
import { getFolder } from 'Board/scenarios/Board/firebase'
import { FieldPath, getFirestore } from 'firebase-admin/firestore'
import { chunk, isEmpty } from 'lodash'
import { redirect } from 'next/navigation'
import { BoardDB, BoardDBSchema } from 'types/db-types/boards'
import { FolderDB, FolderDBSchema } from 'types/db-types/folders'
import { UserDB } from 'types/db-types/users'
import { FIREBASE_DEV_CONFIG, FIREBASE_PRD_CONFIG } from './utils/constants'
import { getUserWithBoardIds, initializeAdminApp } from './utils/firebase'
import { getUserFromSessionCookie } from './utils/server'

initializeAdminApp()

const db = getFirestore()

export async function getFirebaseClientConfig() {
    const env = process.env.GOOGLE_PROJECT_ID
    if (env === 'ent-tavla-prd') return FIREBASE_PRD_CONFIG
    return FIREBASE_DEV_CONFIG
}

function userInFolder(uid?: UserDB['uid'], folder?: FolderDB) {
    return uid && folder && folder.owners?.includes(uid)
}

export async function getFolderIfUserHasAccess(folderid?: FolderDB['id']) {
    if (!folderid) return undefined

    const folder = await getFolder(folderid)

    if (!folder) return redirect('/')

    const user = await getUserFromSessionCookie()

    if (!userInFolder(user?.uid, folder)) {
        return redirect('/')
    }

    return folder
}

export async function getFoldersForUser(): Promise<Folder[]> {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    try {
        const owner = db
            .collection('folders')
            .where('owners', 'array-contains', user.uid)
            .get()

        const queries = await Promise.all([owner])
        const folders = queries
            .map((query) => query.docs)
            .flat()
            .map((folderDocument) => {
                const folderData = {
                    ...folderDocument.data(),
                    id: folderDocument.id,
                }
                const parsedFolder = FolderDBSchema.safeParse(folderData)

                if (!parsedFolder.success) {
                    Sentry.captureMessage(
                        'Folder data validation failed in getFoldersForUser',
                        {
                            level: 'warning',
                            extra: {
                                error: parsedFolder.error.flatten(),
                                folderId: folderDocument.id,
                            },
                        },
                    )
                    return folderData as FolderDB
                }

                return parsedFolder.data
            })

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

export async function getBoardsForFolder(folderid: FolderDB['id']) {
    const folder = await getFolderIfUserHasAccess(folderid)
    if (!folder) return redirect('/')

    const boards = folder.boards
    if (isEmpty(boards)) return []

    const batchedBoardIDs = chunk(boards, 20)

    try {
        const boardQueries = batchedBoardIDs.map((batch) =>
            db
                .collection('boards')
                .where(FieldPath.documentId(), 'in', batch)
                .get(),
        )

        const boardRefs = await Promise.all(boardQueries)

        return boardRefs
            .map((ref) =>
                ref.docs.map((doc) => {
                    const boardData = { id: doc.id, ...doc.data() }
                    const parsedBoard = BoardDBSchema.safeParse(boardData)

                    if (!parsedBoard.success) {
                        Sentry.captureMessage(
                            'Board data validation failed in getBoardsForFolder',
                            {
                                level: 'warning',
                                extra: {
                                    error: parsedBoard.error.flatten(),
                                    boardId: doc.id,
                                    folderID: folderid,
                                },
                            },
                        )
                        return boardData as BoardDB
                    }

                    return parsedBoard.data
                }),
            )
            .flat()
    } catch (error) {
        Sentry.captureMessage(
            'Error while fetching boards for folder with folderID ' + folderid,
        )
        throw error
    }
}

export async function getBoards(ids?: BoardDB['id'][]) {
    if (!ids) return []

    const batches = chunk(ids, 20)
    try {
        const queries = batches.map((batch) =>
            db
                .collection('boards')
                .where(FieldPath.documentId(), 'in', batch)
                .get(),
        )

        const refs = await Promise.all(queries)
        return refs
            .map((ref) =>
                ref.docs.map((doc) => {
                    const boardData = { id: doc.id, ...doc.data() }
                    const parsedBoard = BoardDBSchema.safeParse(boardData)

                    if (!parsedBoard.success) {
                        Sentry.captureMessage(
                            'Board data validation failed in getBoards',
                            {
                                level: 'warning',
                                extra: {
                                    error: parsedBoard.error.flatten(),
                                    boardId: doc.id,
                                },
                            },
                        )
                        return boardData as BoardDB
                    }

                    return parsedBoard.data
                }),
            )
            .flat()
    } catch (error) {
        Sentry.captureMessage('Error while fetching list of boards: ' + ids)
        throw error
    }
}

export async function getPrivateBoardsForUser(folders: FolderDB[]) {
    const userWithBoards = await getUserWithBoardIds()
    if (!userWithBoards?.uid) return []

    const rawOwner = userWithBoards.owner ?? []

    if (!Array.isArray(rawOwner)) {
        Sentry.captureMessage(
            'Invalid owner field type in getPrivateBoardsForUser',
            {
                level: 'warning',
                extra: {
                    userId: userWithBoards.uid,
                    ownerType: typeof rawOwner,
                },
            },
        )
        return []
    }

    const ownedBoardIds = rawOwner.filter(
        (id): id is string => typeof id === 'string',
    )

    if (ownedBoardIds.length === 0) return []

    const boardIdsInFolders = new Set<BoardDB['id']>()
    folders.forEach((folder) => {
        folder?.boards?.forEach((bid) => {
            if (bid) boardIdsInFolders.add(bid)
        })
    })

    const filteredOwnedBoardIds = ownedBoardIds.filter(
        (bid) => !boardIdsInFolders.has(bid),
    )

    if (filteredOwnedBoardIds.length === 0) return []

    const privateBoards = await getBoards(filteredOwnedBoardIds)

    return privateBoards
}
