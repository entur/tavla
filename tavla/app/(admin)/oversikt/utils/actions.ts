'use server'
import { getBoardsForFolder } from 'app/(admin)/actions'
import { moveBoard } from 'app/(admin)/tavler/[id]/rediger/components/Settings/actions'
import { TFormFeedback } from 'app/(admin)/utils'
import { deleteBoard, initializeAdminApp } from 'app/(admin)/utils/firebase'
import { handleError } from 'app/(admin)/utils/handleError'
import { getFolderForBoard } from 'Board/scenarios/Board/firebase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TBoard, TBoardID, TFolder, TFolderID } from 'types/settings'

initializeAdminApp()

export async function deleteBoardAction(
    prevState: TFormFeedback | undefined,
    data: FormData,
) {
    const bid = data.get('bid') as TBoardID
    const folder = await getFolderForBoard(bid)

    try {
        await deleteBoard(bid)
        revalidatePath('/')
    } catch (e) {
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

export async function countAllBoards(folders: TFolder[], boards: TBoard[]) {
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
    const bid = data.get('bid') as TBoardID
    const newFolderID = data.get('newOid') as TFolderID | undefined
    const oldFolder = await getFolderForBoard(bid)
    try {
        await moveBoard(bid, newFolderID, oldFolder?.id)
        revalidatePath('/')
    } catch (e) {
        return handleError(e)
    }
}
