import { Landing } from '../src/Admin/scenarios/Landing'
import classes from 'styles/pages/landing.module.css'
import { Header } from 'components/Header'
import { IncomingNextMessage } from 'types/next'
import { verifySession } from 'Admin/utils/firebase'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

export async function getServerSideProps({
    req,
}: {
    req: IncomingNextMessage
}) {
    const session = req.cookies['session']
    const user = await verifySession(session)

    return {
        props: {
            user: user,
        },
    }
}

function LandingPage({ user }: { user: DecodedIdToken | null }) {
    return (
        <div className={classes.root}>
            <Header className={classes.header} />
            <Landing user={user} />
        </div>
    )
}

export default LandingPage
