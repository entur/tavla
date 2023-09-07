import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { Header } from 'components/Header'
import { Boards } from 'Admin/scenarios/Boards'
import { checkFeatureFlags } from 'utils/featureFlags'
import { TBoard } from 'types/settings'
// import { getBoardsForUser } from 'utils/firebase'

export async function getServerSideProps() {
    const featureFlag = await checkFeatureFlags('BOARDS')
    if (!featureFlag) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    // const boards = await getBoards()
    const boards: TBoard[] = []

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
