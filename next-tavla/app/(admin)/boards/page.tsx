import { redirect } from 'next/navigation'
import { Search } from './components/Search'
import { FilterButton } from './components/FilterButton'
import { BoardTable } from './components/BoardTable'
import { Metadata } from 'next'
import React from 'react'
import { getAllBoardsForUser } from 'app/(admin)/actions'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { Heading1 } from '@entur/typography'
import { uniq } from 'lodash'

initializeAdminApp()

export const metadata: Metadata = {
    title: `Tavler | Entur Tavla`,
}

async function OrganizationsBoardsPage() {
    const user = await getUserFromSessionCookie()
    if (!user) redirect('/')

    const boardsWithOrg = await getAllBoardsForUser()
    const uniqueTags = uniq(
        boardsWithOrg.flatMap(
            (boardWithOrg) => boardWithOrg.board?.meta?.tags ?? [],
        ),
    )
    return (
        <div className="flex flex-col gap-8">
            <Heading1>Tavler</Heading1>
            <div className="flex flex-col sm:flex-row md:items-center gap-3">
                <Search />
                <FilterButton filterOptions={uniqueTags} />
            </div>
            <BoardTable boardsWithOrg={boardsWithOrg} />
        </div>
    )
}

export default OrganizationsBoardsPage
