import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { Boards } from 'Admin/scenarios/Boards'
import { TBoard, TOrganization } from 'types/settings'
import {
    getBoardsWithOrganization,
    getOrganizationsWithUser,
} from 'Admin/utils/firebase'
import { verifyUserSession } from 'Admin/utils/auth'
import { IncomingNextMessage } from 'types/next'
import { AdminHeader } from 'Admin/components/AdminHeader'
import { useRouter } from 'next/router'

export async function getServerSideProps({
    params,
    req,
}: {
    params: { id: string }
    req: IncomingNextMessage
}) {
    const { id } = params
    const user = await verifyUserSession(req)
    if (!user) {
        return {
            redirect: {
                destination: '/#login',
                permanent: false,
            },
        }
    }
    const boards = await getBoardsWithOrganization(id)
    const organizations = await getOrganizationsWithUser(user.uid)

    return {
        props: {
            boards: boards,
            organizations: organizations,
            loggedIn: user !== null,
        },
    }
}

function OverviewPageForOrganization({
    boards,
    organizations,
    loggedIn,
}: {
    boards: TBoard[]
    organizations: TOrganization[]
    loggedIn: boolean
}) {
    const router = useRouter()
    return (
        <div className={classes.root}>
            <AdminHeader loggedIn={loggedIn} />
            <Contrast>
                <ToastProvider>
                    <Boards
                        key={router.asPath}
                        boards={boards}
                        organizations={organizations}
                    />
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default OverviewPageForOrganization
