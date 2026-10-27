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
    createBoard,
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
    logToGcp('info', 'action invoked: deleteBoardAction', {
        type: 'server-action',
        action: 'deleteBoardAction',
        bid,
    })
    const folder = await getFolderForBoard(bid)

    try {
        await deleteBoard(bid)
        revalidatePath('/')
    } catch (e) {
        logToGcp('error', 'action failed: deleteBoardAction', {
            type: 'server-action',
            action: 'deleteBoardAction',
            bid,
            errorName: e instanceof Error ? e.name : undefined,
            errorMessage: e instanceof Error ? e.message : String(e),
        })
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
    logToGcp('info', 'action invoked: moveBoardAction', {
        type: 'server-action',
        action: 'moveBoardAction',
        bid,
    })

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
        logToGcp('error', 'action failed: moveBoardAction', {
            type: 'server-action',
            action: 'moveBoardAction',
            bid,
            errorName: e instanceof Error ? e.name : undefined,
            errorMessage: e instanceof Error ? e.message : String(e),
            context: {
                oldFolderId: oldFolder?.id ?? 'none',
                newFolderId: newFolderID ?? 'none',
            },
        })
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

export async function duplicateBoardAction(board: BoardDB) {
    logToGcp('info', 'action invoked: duplicateBoardAction', {
        type: 'server-action',
        action: 'duplicateBoardAction',
        bid: board.id,
    })

    const user = await getUserFromSessionCookie()
    if (!user) return redirect('/')

    const folder = await getFolderForBoard(board.id)
    if (folder) {
        const canEdit = await userCanEditFolder(folder.id)
        if (!canEdit) return redirect('/')
    }

    const { id: _id, ...duplicationPayload } = board

    let createdBoardId: string
    try {
        const createdBoard = await createBoard({
            ...duplicationPayload,
            meta: {
                ...duplicationPayload.meta,
                title: `${duplicationPayload.meta.title} - duplikat`,
                fontSize: duplicationPayload.meta?.fontSize ?? 'medium',
            },
        })
        createdBoardId = createdBoard.id

        if (folder) await addBoardIdToFolder(folder.id, createdBoardId)
        else await addBoardIdToUser(user.uid, createdBoardId)

        revalidatePath('/')
    } catch (e) {
        logToGcp('error', 'action failed: duplicateBoardAction', {
            type: 'server-action',
            action: 'duplicateBoardAction',
            bid: board.id,
            errorName: e instanceof Error ? e.name : undefined,
            errorMessage: e instanceof Error ? e.message : String(e),
        })
        Sentry.captureException(e, {
            extra: {
                message: 'Error while duplicating board',
                boardID: board.id,
            },
        })
        throw e
    }

    redirect(`/tavler/${createdBoardId}/rediger`)
}
