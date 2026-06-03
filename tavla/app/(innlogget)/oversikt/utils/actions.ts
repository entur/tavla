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
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
    addBoardIdToFolder,
    addBoardIdToUser,
    getFolderForBoard,
    removeBoardIdFromFolder,
    removeBoardIdFromUser,
} from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import type { FolderDB } from 'src/types/db-types/folders'
import { logToGcp } from 'src/utils/logging'
import { getUserFromSessionCookie } from '../../utils/server'

initializeAdminApp()

export async function deleteBoardAction(
    _prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const bid = data.get('bid') as BoardDB['id']
    logToGcp('info', 'action:deleteBoardAction invoked', { bid })
    const folder = await getFolderForBoard(bid)

    try {
        await deleteBoard(bid)
        revalidatePath('/')
    } catch (e) {
        logToGcp(
            'error',
            `Failed to delete board: ${e instanceof Error ? e.message : String(e)}`,
            { bid },
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

export async function moveBoardAction(data: FormData) {
    const bid = data.get('bid') as BoardDB['id']
    logToGcp('info', 'action:moveBoardAction invoked', { bid })

    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    const newFolderID = data.get('newOid') as FolderDB['id'] | undefined
    const oldFolder = await getFolderForBoard(bid)

    if (oldFolder?.id) {
        const canEdit = await userCanEditFolder(oldFolder.id)
        if (!canEdit) return redirect('/')
    }

    if (newFolderID) {
        const canEdit = await userCanEditFolder(newFolderID)
        if (!canEdit) return redirect('/')
    }

    try {
        if (oldFolder?.id) await removeBoardIdFromFolder(oldFolder.id, bid)
        else await removeBoardIdFromUser(user.uid, bid)

        if (newFolderID) await addBoardIdToFolder(newFolderID, bid)
        else await addBoardIdToUser(user.uid, bid)

        revalidatePath('/')
    } catch (e) {
        logToGcp(
            'error',
            `Failed to move board: ${e instanceof Error ? e.message : String(e)}`,
            { bid },
        )
        Sentry.captureException(e, {
            extra: {
                message: 'Error while moving board to new folder',
                boardID: bid,
                newFolder: newFolderID,
                oldFolder: oldFolder?.id,
            },
        })
        return handleError(e)
    }
}
