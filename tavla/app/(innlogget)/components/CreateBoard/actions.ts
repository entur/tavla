'use server'
import * as Sentry from '@sentry/nextjs'
import { initializeAdminApp } from 'app/(innlogget)/utils/firebase'
import {
    getFormFeedbackForError,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { handleError } from 'app/(innlogget)/utils/handleError'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import { redirect } from 'next/navigation'
import { addBoard, addBoardIdToFolder, addBoardIdToUser } from 'src/firebase'
import type { FolderDB } from 'src/types/db-types/folders'
import { logToGcp } from 'src/utils/logging'

initializeAdminApp()

export async function createBoard(
    _prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const name = data.get('name') as string
    if (!name) return getFormFeedbackForError('board/name-missing')

    const folderid = data.get('folderid') as FolderDB['id']

    const user = await getUserFromSessionCookie()
    if (!user) return getFormFeedbackForError('auth/operation-not-allowed')
    logToGcp('info', 'action:createBoard invoked')

    let createdBoard: FirebaseFirestore.DocumentReference | undefined

    try {
        createdBoard = await addBoard({
            tiles: [],
            theme: 'dark',
            isCombinedTiles: false,
            meta: {
                title: name.substring(0, 50),
                fontSize: 'medium',
            },
        })

        if (!createdBoard) return getFormFeedbackForError('firebase/general')

        if (folderid) {
            await addBoardIdToFolder(folderid, createdBoard.id)
        } else {
            await addBoardIdToUser(user.uid, createdBoard.id)
        }
    } catch (error) {
        logToGcp(
            'error',
            `Failed to create board: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message:
                    'Error while adding newly created board to either user or folder',
                userID: user.uid,
                folderID: folderid,
            },
        })
        return handleError(error)
    }

    redirect(`/tavler/${createdBoard.id}/rediger`)
}
