import { Landing } from '../src/Admin/scenarios/Landing'
import classes from 'styles/pages/landing.module.css'
import { IncomingNextMessage } from 'types/next'
import { verifySession } from 'Admin/utils/firebase'
import { AdminHeader } from 'Admin/components/AdminHeader'
import TavlaHead from 'components/TavlaHead'

export async function getServerSideProps({
    req,
}: {
    req: IncomingNextMessage
}) {
    const session = req.cookies['session']
    const loggedIn = (await verifySession(session)) !== null

    return {
        props: {
            loggedIn,
        },
    }
}

function LandingPage({ loggedIn }: { loggedIn: boolean }) {
    return (
        <div className={classes.root}>
            <TavlaHead title="Forside" description="Forside for Entur Tavla" />
            <div className={classes.header}>
                <AdminHeader loggedIn={loggedIn} />
            </div>
            <Landing loggedIn={loggedIn} />
        </div>
    )
}

export default LandingPage
