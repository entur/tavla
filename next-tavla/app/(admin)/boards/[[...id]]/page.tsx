import { permanentRedirect } from 'next/navigation'
import { Search } from '../components/Search'
import { FilterButton } from '../components/FilterButton'
import { BoardTable } from '../components/BoardTable'
import { Metadata } from 'next'
import React from 'react'
import {
    getBoardsForOrganization,
    getBoardsForUser,
    getOrganizationIfUserHasAccess,
} from 'app/(admin)/actions'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { Heading1 } from '@entur/typography'

initializeAdminApp()

type TProps = {
    params: { id: string[] }
}

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
    const { id } = params

    const organization = id
        ? await getOrganizationIfUserHasAccess(id[0] ?? '')
        : { name: 'Mine' }

    return {
        title: `${organization?.name} tavler | Entur Tavla`,
    }
}

async function OrganizationsBoardsPage({ params }: TProps) {
    const { id } = params
    const user = await getUserFromSessionCookie()
    if (!user) permanentRedirect('/')
    const activeOrganization = await getOrganizationIfUserHasAccess(
        (id ?? '')[0],
    )

    const hasAccess =
        activeOrganization &&
        (activeOrganization.owners?.includes(user.uid) ||
            activeOrganization.editors?.includes(user.uid))

    if (id && !hasAccess) {
        return <div>Du har ikke tilgang til denne organisasjonen</div>
    }

    const boards = id
        ? await getBoardsForOrganization(id[0] ?? '')
        : await getBoardsForUser()

    return (
        <div className="flex flex-col gap-8">
            <Heading1>Tavler</Heading1>
            <div className="flex flex-col sm:flex-row md:items-center gap-3">
                <Search />
                <FilterButton boards={boards} />
            </div>
            <BoardTable boards={boards} />
        </div>
    )
}

export default OrganizationsBoardsPage
