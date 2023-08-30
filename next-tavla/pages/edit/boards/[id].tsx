import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { Header } from 'components/Header'
import { Admin } from 'Admin/scenarios/Boards'
import { TSettings } from 'types/settings'
import { checkFeatureFlags } from 'utils/featureFlags'
import { getBoards } from 'utils/firebase'

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
                <Admin boards={boards} />
            </ToastProvider>
        </Contrast>
    )
}

export default OverviewPage
