import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { Boards } from 'Admin/scenarios/Boards'
import { TBoard } from 'types/settings'
import { getBoardsForUser } from 'Admin/utils/firebase'
import { verifyUserSession } from 'Admin/utils/auth'
import { IncomingNextMessage } from 'types/next'
import { AdminHeader } from 'Admin/components/AdminHeader'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

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

    return {
        props: {
            boards: boards,
            user: user,
        },
    }
}

function OverviewPage({
    boards,
    user,
}: {
    boards: TBoard[]
    user: DecodedIdToken | null
}) {
    return (
        <div className={classes.root}>
            <AdminHeader user={user} options={['create']} />
            <Contrast>
                <ToastProvider>
                    <Boards boards={boards} />
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default OverviewPage
