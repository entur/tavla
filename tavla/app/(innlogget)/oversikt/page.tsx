import { Heading1 } from '@entur/typography'
import {
    getBoards,
    getFoldersForUser,
    getPrivateBoardsForUser,
} from 'app/(innlogget)/actions'
import { initializeAdminApp } from 'app/(innlogget)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CreateBoard } from '../components/CreateBoard/CreateBoard'
import { CreateFolder } from '../components/CreateFolder/CreateFolder'
import { FoldersAndBoardsContent } from './components/FoldersAndBoardsContent'
import { LocalStorageBoardBanner } from './components/LocalStorageBoardBanner'

initializeAdminApp()

export const metadata: Metadata = {
    title: `Mapper og tavler | Entur Tavla - Sanntidsskjerm og avgangstavle for offentlig transport`,
    description: `Se og administrer alle dine tavler og mapper på ett sted. Opprett nye tavler, organiser dem i mapper og inviter andre til å samarbeide.`,
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

    return (
        <main id="main-content" className="container flex flex-col gap-8 pb-20">
            <div className="flex flex-row justify-between max-sm:flex-col">
                <Heading1>Mine tavler</Heading1>
                <div className="flex flex-row gap-4">
                    <CreateBoard folders={folders} trackingLocation="admin" />
                    <CreateFolder />
                </div>
            </div>
            <LocalStorageBoardBanner />

            <div className="gap-4">
                <FoldersAndBoardsContent
                    folders={folders}
                    privateBoards={privateBoards}
                    allBoards={allBoards}
                />
            </div>
        </main>
    )
}

export default FoldersAndBoardsPage
