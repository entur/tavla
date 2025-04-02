'use server'
import { TFormFeedback } from 'app/(admin)/utils'
import { revalidatePath } from 'next/cache'
import { deleteBoard, initializeAdminApp } from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'
import { handleError } from 'app/(admin)/utils/handleError'
import {
    TBoard,
    TBoardID,
    TOrganization,
    TOrganizationID,
} from 'types/settings'
import { getBoardsForOrganization } from 'app/(admin)/actions'

initializeAdminApp()

export async function deleteBoardAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const bid = data.get('bid') as TBoardID
    const oid = data.get('oid') as TOrganizationID
    try {
        await deleteBoard(bid)
        revalidatePath('/')
    } catch (e) {
        return handleError(e)
    }
    if (oid) redirect(`/boards/${oid}`)
    redirect('/boards')
}

export async function getBoardsInFolder(folderId?: string) {
    if (folderId) {
        const boardsInFolder = await getBoardsForOrganization(folderId)
        return boardsInFolder.length
    } else {
        return 0
    }
}

export async function getNumberOfBoards(
    folders: TOrganization[],
    boards: TBoard[],
) {
    const folderCounts = await Promise.all(
        folders.map(async (folder) => await getBoardsInFolder(folder.id)),
    )

    const total = folderCounts.reduce((sum, count) => sum + count, 0)
    return total + boards.length
}
