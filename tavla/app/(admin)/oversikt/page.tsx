import { redirect } from 'next/navigation'
import { Search } from './components/Search'
import { BoardTable } from './components/BoardTable'
import { Metadata } from 'next'
import React from 'react'
import {
    getOrganizationsForUser,
    getPrivateBoardsForUser,
} from 'app/(admin)/actions'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { Heading1, Label } from '@entur/typography'
import { CreateFolder } from '../components/CreateFolder'
import { CreateBoard } from '../components/CreateBoard'
import { countAllBoards } from './utils/actions'
import EmptyOverview from './components/EmptyOverview'

initializeAdminApp()

export const metadata: Metadata = {
    title: `Mapper og tavler | Entur Tavla`,
}

async function FoldersAndBoardsPage() {
    const user = await getUserFromSessionCookie()
    if (!user) redirect('/')

    const folders = await getOrganizationsForUser()
    const privateBoards = await getPrivateBoardsForUser()
    const count = await countAllBoards(folders, privateBoards)
    const elementsListCount = privateBoards.length + folders.length

    return (
        <div className="container flex flex-col gap-8 pb-20">
            <div className="flex flex-row justify-between max-sm:flex-col">
                <Heading1>Mine tavler</Heading1>
                <div className="flex flex-row gap-4">
                    <CreateFolder />
                    <CreateBoard />
                </div>
            </div>

            <div className="gap-4">
                {elementsListCount === 0 ? (
                    <EmptyOverview text="Her var det tomt gitt! Start med å opprette en mappe eller en tavle" />
                ) : (
                    <>
                        <Search />
                        <div className="mt-8 flex flex-col">
                            <Label>Totalt antall tavler: {count}</Label>
                            <BoardTable
                                folders={folders}
                                boards={privateBoards}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default FoldersAndBoardsPage
