import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { Boards } from 'Admin/scenarios/Boards'
import { TBoard, TOrganization } from 'types/settings'
import {
    getBoardsForUser,
    getOrganizationsWithUser,
} from 'Admin/utils/firebase'
import { verifyUserSession } from 'Admin/utils/auth'
import { IncomingNextMessage } from 'types/next'
import { AdminHeader } from 'Admin/components/AdminHeader'
import { SelectOrganization } from 'Admin/scenarios/Boards/components/SelectOrganization'

export async function getServerSideProps({
    req,
}: {
    req: IncomingNextMessage
}) {
    const user = await verifyUserSession(req)
    if (!user) {
        return {
            redirect: {
                destination: '/#login',
                permanent: false,
            },
        }
    }
    const boards = await getBoardsForUser(user.uid)
    const organizations = await getOrganizationsWithUser(user.uid)

    return {
        props: {
            boards: boards,
            organizations: organizations,
        },
    }
}

function OverviewPage({
    boards,
    organizations,
}: {
    boards: TBoard[]
    organizations: TOrganization[]
}) {
    return (
        <div className={classes.root}>
            <AdminHeader loggedIn />
            <Contrast>
                <ToastProvider>
                    <div className="flexRow g-3 h-100">
                        <SelectOrganization organizations={organizations} />
                        <Boards boards={boards} />
                    </div>
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default OverviewPage
