import * as Sentry from '@sentry/nextjs'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getFirestore } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { BoardDB } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'

initializeAdminApp()

const db = getFirestore()

const allowedOrigins = [
    'https://vis-tavla.dev.entur.no',
    'https://vis-tavla.entur.no',
    'http://localhost:5173',
]

function getCorsHeaders(request: NextRequest) {
    const origin = request.headers.get('origin')
    const allowOrigin =
        origin && allowedOrigins.includes(origin)
            ? origin
            : 'https://vis-tavla.entur.no'

    return {
        'Access-Control-Allow-Origin':
            process.env.NODE_ENV === 'development' ? '*' : allowOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
}

export async function OPTIONS(request: NextRequest) {
    return NextResponse.json({}, { headers: getCorsHeaders(request) })
}

async function fetchBoardById(boardId: BoardDB['id']): Promise<BoardDB | null> {
    const boardDoc = await db.collection('boards').doc(boardId).get()

    if (!boardDoc.exists) {
        return null
    }

    return { id: boardId, ...boardDoc.data() } as BoardDB
}

async function fetchFolderLogo(boardId: BoardDB['id']): Promise<string | null> {
    const foldersSnapshot = await db
        .collection('folders')
        .where('boards', 'array-contains', boardId)
        .get()

    if (foldersSnapshot.empty || !foldersSnapshot.docs[0]) {
        return null
    }

    const folderData = foldersSnapshot.docs[0].data() as FolderDB
    return folderData.logo ?? null
}

function createErrorResponse(
    request: NextRequest,
    message: string,
    status: number,
) {
    return NextResponse.json(
        { error: message },
        { status, headers: getCorsHeaders(request) },
    )
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const boardIdParam = searchParams.get('id')

    if (!boardIdParam) {
        return createErrorResponse(request, 'Board ID is required', 400)
    }

    const boardId = boardIdParam satisfies BoardDB['id']

    try {
        const boardData = await fetchBoardById(boardId)
        if (!boardData) {
            return createErrorResponse(request, 'Board not found', 404)
        }

        const folderLogo = await fetchFolderLogo(boardId)

        return NextResponse.json(
            {
                board: boardData,
                folderLogo,
            },
            { headers: getCorsHeaders(request) },
        )
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while fetching board',
                boardId: boardId,
            },
        })
        return createErrorResponse(request, 'Internal server error', 500)
    }
}
