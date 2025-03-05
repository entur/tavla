import { redirect } from 'next/navigation'
import { Search } from './components/Search'
import { BoardTable } from './components/BoardTable'
import { Metadata } from 'next'
import React from 'react'
import { getBoards, getOrganizationsForUser } from 'app/(admin)/actions'
import {
    getUserWithBoardIds,
    initializeAdminApp,
} from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { Heading1 } from '@entur/typography'
import { TBoardID } from 'types/settings'
import { Button } from '@entur/button'
import Link from 'next/link'
import { BoardIcon } from '@entur/icons'
import { CreateOrganization } from '../components/CreateOrganization'

initializeAdminApp()

export const metadata: Metadata = {
    title: `Mapper og Tavler | Entur Tavla`,
}

async function FolderAndBoardsPage() {
    const user = await getUserFromSessionCookie()
    if (!user) redirect('/')

    const folders = await getOrganizationsForUser()
    const userWithBoards = await getUserWithBoardIds()
    const boardsWithoutFolder = await getBoards(
        userWithBoards?.owner as TBoardID[],
    )

    return (
        <div className="flex flex-col gap-8 container pb-20">
            <div className="flex flex-row justify-between">
                <Heading1>Mapper og Tavler</Heading1>
                <div className="flex flex-row gap-4">
                    <Button variant="secondary" as={Link} href="boards/?board">
                        Opprett tavle
                        <BoardIcon inline aria-label="Tavle-ikon" />
                    </Button>
                    <CreateOrganization />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row md:items-center gap-3">
                <Search />
            </div>
            <BoardTable
                folders={folders}
                boardsWithoutFolder={boardsWithoutFolder}
            />
        </div>
    )
}

export default FolderAndBoardsPage
