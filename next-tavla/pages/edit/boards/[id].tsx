import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { Header } from 'components/Header'
import { Boards } from 'Admin/scenarios/Boards'
import { TSettings } from 'types/settings'
import { checkFeatureFlags } from 'utils/featureFlags'
import { getBoards } from 'utils/firebase'
import { IncomingNextMessage } from 'types/next'
import { verifySession } from 'Admin/utils/firebase'

export async function getServerSideProps({
    req,
}: {
    req: IncomingNextMessage
}) {
    const BOARDS_ENABLED = await checkFeatureFlags('BOARDS')

    if (!BOARDS_ENABLED) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const LOGIN_ENABLED = await checkFeatureFlags('LOGIN')

    const session = req.cookies['session']
    const user = await verifySession(session)

    if (!user && LOGIN_ENABLED) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const boards = await getBoards()

    return {
        props: {
            boards: boards,
        },
    }
}

function OverviewPage({
    boards,
}: {
    boards: { id: string; settings?: TSettings }[]
}) {
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
