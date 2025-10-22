import { Heading1 } from '@entur/typography'
import {
    getBoards,
    getFoldersForUser,
    getPrivateBoardsForUser,
} from 'app/(admin)/actions'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CreateBoard } from '../components/CreateBoard'
import { CreateFolder } from '../components/CreateFolder'
import { FoldersAndBoardsContent } from './components/FoldersAndBoardsContent'

initializeAdminApp()

export const metadata: Metadata = {
    title: `Mapper og tavler | Entur Tavla`,
}

async function FoldersAndBoardsPage() {
    const user = await getUserFromSessionCookie()
    if (!user) redirect('/')

    const folders = await getFoldersForUser()
    const privateBoards = await getPrivateBoardsForUser(folders)

    const allFolderBoardIds = folders
        .flatMap((folder) => folder.boards || [])
        .filter(Boolean)
    const folderBoards =
        allFolderBoardIds.length > 0 ? await getBoards(allFolderBoardIds) : []
    const allBoards = [...privateBoards, ...folderBoards]

    const boardCountInFolder = folders.map((folder) => folder.boardCount)

    const elementsListCount = privateBoards.length + folders.length

    const totalBoards =
        boardCountInFolder.reduce((sum, count) => sum + count, 0) +
        privateBoards.length

    return (
        <div className="container flex flex-col gap-8 pb-20">
            <div className="flex flex-row justify-between max-sm:flex-col">
                <Heading1>Mine tavler</Heading1>
                <div className="flex flex-row gap-4">
                    <CreateBoard />
                    <CreateFolder />
                </div>
            </div>

            <div className="gap-4">
                <FoldersAndBoardsContent
                    folders={folders}
                    privateBoards={privateBoards}
                    allBoards={allBoards}
                    totalBoards={totalBoards}
                    elementsListCount={elementsListCount}
                />
            </div>
        </div>
    )
}

export default FoldersAndBoardsPage
