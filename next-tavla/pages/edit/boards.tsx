import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { Header } from 'components/Header'
import { Boards } from 'Admin/scenarios/Boards'
import { TBoard } from 'types/settings'
import { getBoardsForUser } from 'Admin/utils/firebase'
import { verifyUserSession } from 'Admin/utils/auth'
import { IncomingNextMessage } from 'types/next'

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
        },
    }
}

function OverviewPage({ boards }: { boards: TBoard[] }) {
    return (
        <Contrast className={classes.root}>
            <ToastProvider>
                <Header />
                <Boards boards={boards} />
            </ToastProvider>
        </Contrast>
    )
}

export default OverviewPage
