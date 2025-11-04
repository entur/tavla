import * as Sentry from '@sentry/nextjs'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { firestore } from 'firebase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { BoardDB, BoardId } from 'types/db-types/boards'
import { FolderDB } from 'types/db-types/folders'

initializeAdminApp()

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get('id') as BoardId

    if (!boardId) {
        return NextResponse.json(
            { error: 'Board ID is required' },
            { status: 400 },
        )
    }

    try {
        const boardDoc = await firestore()
            .collection('boards')
            .doc(boardId)
            .get()

        if (!boardDoc.exists) {
            return NextResponse.json(
                { error: 'Board not found' },
                { status: 404 },
            )
        }

        const boardData = { id: boardId, ...boardDoc.data() } as BoardDB

        const foldersSnapshot = await firestore()
            .collection('folders')
            .where('boards', 'array-contains', boardId)
            .get()

        let folderLogo: string | undefined

        if (!foldersSnapshot.empty && foldersSnapshot.docs[0]) {
            const folderDoc = foldersSnapshot.docs[0]
            const folderData = folderDoc.data() as FolderDB

            if (folderData.logo) {
                folderLogo = folderData.logo
            }
        }

        return NextResponse.json({
            board: boardData,
            folderLogo: folderLogo ?? null,
        })
    } catch (error) {
        Sentry.captureException(error, {
            extra: {
                message: 'Error while fetching board',
                boardId: boardId,
            },
        })
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
