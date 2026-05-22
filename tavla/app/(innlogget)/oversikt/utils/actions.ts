'use server'
import * as Sentry from '@sentry/nextjs'
import { getBoardsForFolder } from 'app/(innlogget)/actions'
import {
    deleteBoard,
    initializeAdminApp,
    userCanEditFolder,
} from 'app/(innlogget)/utils/firebase'
import type { TFormFeedback } from 'app/(innlogget)/utils/forms'
import { handleError } from 'app/(innlogget)/utils/handleError'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getFolderForBoard } from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import type { FolderDB } from 'src/types/db-types/folders'
import { logToGcp } from 'src/utils/logging'
import { getUserFromSessionCookie } from '../../utils/server'

initializeAdminApp()
const db = getFirestore()

export async function deleteBoardAction(
    _prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const bid = data.get('bid') as BoardDB['id']
    const folder = await getFolderForBoard(bid)

    try {
        await deleteBoard(bid)
        revalidatePath('/')
    } catch (e) {
        await logToGcp(
            'error',
            `Failed to delete board ${bid}: ${e instanceof Error ? e.message : String(e)}`,
        )
        return handleError(e)
    }
    if (folder) redirect(`/mapper/${folder?.id}`)
    redirect('/oversikt')
}

export async function getNumberOfBoardsInFolder(folderId?: string) {
    if (!folderId) return 0

    const boardsInFolder = await getBoardsForFolder(folderId)
    return boardsInFolder.length
}

export async function countAllBoards(folders: FolderDB[], boards: BoardDB[]) {
    const folderCounts = await Promise.all(
        folders.map(
            async (folder) => await getNumberOfBoardsInFolder(folder.id),
        ),
    )

    let count = boards.length
    folderCounts.map((folderCount) => (count += folderCount))
    return count
}

export async function moveBoard(
    bid: BoardDB['id'],
    toFolder?: FolderDB['id'],
    fromFolder?: FolderDB['id'],
) {
    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    if (fromFolder) {
        const canEdit = await userCanEditFolder(fromFolder)
        if (!canEdit) return redirect('/')
    }

    if (toFolder) {
        const canEdit = await userCanEditFolder(toFolder)
        if (!canEdit) return redirect('/')
    }

    try {
        if (fromFolder)
            await db
                .collection('folders')
                .doc(fromFolder)
                .update({ boards: FieldValue.arrayRemove(bid) })
        else
            await db
                .collection('users')
                .doc(user.uid)
                .update({ owner: FieldValue.arrayRemove(bid) })

        if (toFolder)
            await db
                .collection('folders')
                .doc(toFolder)
                .update({ boards: FieldValue.arrayUnion(bid) })
        else
            await db
                .collection('users')
                .doc(user.uid)
                .update({ owner: FieldValue.arrayUnion(bid) })
    } catch (error) {
        await logToGcp(
            'error',
            `Failed to move board ${bid}: ${error instanceof Error ? error.message : String(error)}`,
        )
        Sentry.captureException(error, {
            extra: {
                message: 'Error while moving board to new folder',
                boardID: bid,
                newFolder: toFolder,
                oldFolder: fromFolder,
            },
        })
        throw error
    }
}

export async function moveBoardAction(data: FormData) {
    const bid = data.get('bid') as BoardDB['id']
    const newFolderID = data.get('newOid') as FolderDB['id'] | undefined
    const oldFolder = await getFolderForBoard(bid)
    try {
        await moveBoard(bid, newFolderID, oldFolder?.id)
        revalidatePath('/')
    } catch (e) {
        await logToGcp(
            'error',
            `Failed to move board ${bid}: ${e instanceof Error ? e.message : String(e)}`,
        )
        return handleError(e)
    }
}
