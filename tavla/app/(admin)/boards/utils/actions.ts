'use server'
import { TFormFeedback } from 'app/(admin)/utils'
import { revalidatePath } from 'next/cache'
import { deleteBoard, initializeAdminApp } from 'app/(admin)/utils/firebase'
import { redirect } from 'next/navigation'
import { handleError } from 'app/(admin)/utils/handleError'
import { TBoard, TBoardID, TOrganization } from 'types/settings'
import { getBoardsForOrganization } from 'app/(admin)/actions'
import { getOrganizationForBoard } from 'Board/scenarios/Board/firebase'

initializeAdminApp()

export async function deleteBoardAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const bid = data.get('bid') as TBoardID
    const organization = await getOrganizationForBoard(bid)

    try {
        await deleteBoard(bid)
        revalidatePath('/')
    } catch (e) {
        return handleError(e)
    }
    if (organization) redirect(`/boards/${organization?.id}`)
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
