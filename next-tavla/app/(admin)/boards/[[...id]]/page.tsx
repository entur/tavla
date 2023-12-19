import classes from 'styles/pages/admin.module.css'
import {
    getBoardsForOrganization,
    getBoardsForUser,
    getOrganization,
    getOrganizationById,
    getOrganizationsWithUser,
    initializeAdminApp,
} from 'Admin/utils/firebase'
import { permanentRedirect } from 'next/navigation'
import { SelectOrganization } from '../components/SelectOrganization'
import { Search } from '../components/Search'
import { FilterButton } from '../components/FilterButton'
import { ToggleBoardsColumns } from '../components/ToggleBoardsColumns'
import { BoardTable } from '../components/BoardTable'
import { Metadata } from 'next'
import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import React from 'react'
import { TOrganization } from 'types/settings'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

initializeAdminApp()

type TProps = {
    params: { id: string }
}

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
    const { id } = params

    const organization = id
        ? await getOrganizationById(id[0] ?? '')
        : { name: 'Mine' }

    return {
        title: `${organization.name} tavler | Entur Tavla`,
    }
}

async function OrganizationsBoardsPage({ params }: { params: { id: string } }) {
    const { id } = params
    const user = await getUserFromSessionCookie()
    if (!user) permanentRedirect('/')
    const organizations = await getOrganizationsWithUser(user.uid)
    const activeOrganization = id
        ? await getOrganization(id[0] ?? '')
        : undefined

    const hasAccess = (
        organization: TOrganization | undefined,
        user: DecodedIdToken,
    ) => {
        return (
            organization &&
            (organization.owners?.includes(user.uid) ||
                organization.editors?.includes(user.uid))
        )
    }

    if (id && !hasAccess(activeOrganization, user)) {
        return <div>Du har ikke tilgang til denne organisasjonen</div>
    }

    const boards = id
        ? await getBoardsForOrganization(id[0] ?? '')
        : await getBoardsForUser(user.uid)
    return (
        <div className={classes.root}>
            <div className="flexRow g-2">
                <SelectOrganization
                    organizations={organizations}
                    active={activeOrganization}
                />
                <div className="flexColumn mt-2 g-3 w-100">
                    <div className="flexRow alignCenter g-1">
                        <Search />
                        <div className="flexRow g-1">
                            <FilterButton boards={boards} />
                            <ToggleBoardsColumns />
                        </div>
                    </div>
                    <BoardTable boards={boards} />
                </div>
            </div>
        </div>
    )
}

export default OrganizationsBoardsPage
