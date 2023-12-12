import classes from 'styles/pages/admin.module.css'
import {
    getBoardsForUser,
    getOrganizationsWithUser,
    initializeAdminApp,
} from 'Admin/utils/firebase'
import { permanentRedirect } from 'next/navigation'
import { SelectOrganization } from './components/SelectOrganization'
import { Search } from './components/Search'
import { FilterButton } from './components/FilterButton'
import { ToggleBoardsColumns } from './components/ToggleBoardsColumns'
import { BoardTable } from './components/BoardTable'
import { Metadata } from 'next'
import { getUserFromSessionCookie } from 'Admin/utils/formActions'

export const metadata: Metadata = {
    title: 'Mine tavler | Entur Tavla',
}

initializeAdminApp()

async function BoardsPage() {
    const user = await getUserFromSessionCookie()

    if (!user) permanentRedirect('/')
    const boards = await getBoardsForUser(user.uid)
    const organizations = await getOrganizationsWithUser(user.uid)

    return (
        <div className={classes.root}>
            <div className="flexRow g-2">
                <SelectOrganization organizations={organizations} />
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

export default BoardsPage
