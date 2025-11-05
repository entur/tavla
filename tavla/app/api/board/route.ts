import * as Sentry from '@sentry/nextjs'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { BoardDB, BoardId } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'

initializeAdminApp()

async function fetchBoardById(boardId: BoardId): Promise<BoardDB | null> {
    const boardDoc = await firestore().collection('boards').doc(boardId).get()

    if (!boardDoc.exists) {
        return null
    }

    return { id: boardId, ...boardDoc.data() } as BoardDB
}

async function fetchFolderLogo(boardId: BoardId): Promise<string | null> {
    const foldersSnapshot = await firestore()
        .collection('folders')
        .where('boards', 'array-contains', boardId)
        .get()

    if (foldersSnapshot.empty || !foldersSnapshot.docs[0]) {
        return null
    }

    const folderData = foldersSnapshot.docs[0].data() as FolderDB
    return folderData.logo ?? null
}

function createErrorResponse(message: string, status: number) {
    return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get('id') as BoardId

    if (!boardId) {
        return createErrorResponse('Board ID is required', 400)
    }

    try {
        const boardData = await fetchBoardById(boardId)
        if (!boardData) {
            return createErrorResponse('Board not found', 404)
        }

        const folderLogo = await fetchFolderLogo(boardId)

        return NextResponse.json({ board: boardData, folderLogo })
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while fetching board',
                boardId: boardId,
            },
        })
        return createErrorResponse('Internal server error', 500)
    }
}
