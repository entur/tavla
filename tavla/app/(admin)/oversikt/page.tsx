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
import { Heading1 } from '@entur/typography'
import { CreateOrganization } from '../components/CreateOrganization'
import { CreateBoard } from '../components/CreateBoard'
import { getNumberOfBoards } from './utils'

initializeAdminApp()

export const metadata: Metadata = {
    title: `Mapper og tavler | Entur Tavla`,
}

async function FoldersAndBoardsPage() {
    const user = await getUserFromSessionCookie()
    if (!user) redirect('/')

    const folders = await getOrganizationsForUser()
    const privateBoards = await getPrivateBoardsForUser()

    return (
        <div className="flex flex-col gap-8 container pb-20">
            <div className="flex max-sm:flex-col flex-row justify-between">
                <Heading1>Mapper og tavler</Heading1>
                <div className="flex flex-row gap-4">
                    <CreateBoard />
                    <CreateOrganization />
                </div>
            </div>
            <Search />
            <div>
                <p className="pb-[16px] text-[0.9rem] text-gray-500">
                    Totalt antall tavler:{' '}
                    {getNumberOfBoards(folders, privateBoards)}
                </p>
                <BoardTable folders={folders} boards={privateBoards} />
            </div>
        </div>
    )
}

export default FoldersAndBoardsPage
