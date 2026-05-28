import * as Sentry from '@sentry/nextjs'
import { initializeAdminApp } from 'app/(innlogget)/utils/firebase'
import { type NextRequest, NextResponse } from 'next/server'
import { getBoard, getBoardByCustomUrl, getFolderForBoard } from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

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
    const board = await getBoard(boardId)
    if (!board) return null
    const { location: _, ...meta } = board.meta
    return { ...board, meta }
}

async function fetchFolderLogo(boardId: BoardDB['id']): Promise<string | null> {
    const folder = await getFolderForBoard(boardId)
    return folder?.logo ?? null
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
        const boardData =
            (boardId.length === 20 ? await fetchBoardById(boardId) : null) ??
            (await getBoardByCustomUrl(boardId))

        if (!boardData) {
            logToGcp('warning', `GET /api/board: boardId=${boardId} status=404`)
            return createErrorResponse(request, 'Board not found', 404)
        }

        const folderLogo = await fetchFolderLogo(boardData.id)

        const origin = request.headers.get('origin') ?? 'unknown'
        logToGcp(
            'info',
            `GET /api/board: boardId=${boardId} status=200 origin=${origin}`,
        )
        return NextResponse.json(
            {
                board: boardData,
                folderLogo,
            },
            { headers: getCorsHeaders(request) },
        )
    } catch (error) {
        logToGcp(
            'error',
            `Failed to fetch board ${boardId}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while fetching board',
                boardId: boardId,
            },
        })
        return createErrorResponse(request, 'Internal server error', 500)
    }
}
