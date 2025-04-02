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
    if (organization) redirect(`/mapper/${organization?.id}`)
    redirect('/oversikt')
}

export async function getNumberOfBoardsInFolder(folderId?: string) {
    if (!folderId) return 0

    const boardsInFolder = await getBoardsForOrganization(folderId)
    return boardsInFolder.length
}

export async function countAllBoards(
    folders: TOrganization[],
    boards: TBoard[],
) {
    const folderCounts = await Promise.all(
        folders.map(
            async (folder) => await getNumberOfBoardsInFolder(folder.id),
        ),
    )

    let count = boards.length
    folderCounts.map((folderCount) => (count += folderCount))
    return count
}
