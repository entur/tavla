import { Heading1, Label } from '@entur/typography'
import {
    getBoardsForFolder,
    getFoldersForUser,
    getPrivateBoardsForUser,
} from 'app/(admin)/actions'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CreateBoard } from '../components/CreateBoard'
import { CreateFolder } from '../components/CreateFolder'
import { BoardTable } from './components/BoardTable'
import EmptyOverview from './components/EmptyOverview'
import { Search } from './components/Search'

initializeAdminApp()

export const metadata: Metadata = {
    title: `Mapper og tavler | Entur Tavla`,
}

async function FoldersAndBoardsPage() {
    const user = await getUserFromSessionCookie()
    if (!user) redirect('/')

    const folders = await getFoldersForUser()
    const privateBoards = await getPrivateBoardsForUser()
    const boardCountInFolder = await Promise.all(
        folders.map((folder) => getBoardsForFolder(folder.id!)),
    )
    const elementsListCount = privateBoards.length + folders.length

    const counts: Record<string, number> = Object.fromEntries(
        folders.map((folder, idx) => [
            folder.id!,
            boardCountInFolder[idx]?.length ?? 0,
        ]),
    )

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
                {elementsListCount === 0 ? (
                    <EmptyOverview text="Her var det tomt gitt! Start med å opprette en mappe eller en tavle" />
                ) : (
                    <>
                        <Search />
                        <div className="mt-8 flex flex-col">
                            <Label>
                                Totalt antall tavler:{' '}
                                {boardCountInFolder.reduce(
                                    (sum, boards) => sum + boards.length,
                                    0,
                                )}
                            </Label>
                            <BoardTable
                                folders={folders}
                                boards={privateBoards}
                                folderBoardCounts={counts}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default FoldersAndBoardsPage
