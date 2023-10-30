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
            loggedIn: user !== null,
        },
    }
}

function OverviewPage({
    boards,
    organizations,
    loggedIn,
}: {
    boards: TBoard[]
    organizations: TOrganization[]
    loggedIn: boolean
}) {
    return (
        <div className={classes.root}>
            <AdminHeader loggedIn={loggedIn} />
            <Contrast>
                <ToastProvider>
                    <Boards boards={boards} organizations={organizations} />
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default OverviewPage
