import { Landing } from '../src/Admin/scenarios/Landing'
import classes from 'styles/pages/landing.module.css'
import { IncomingNextMessage } from 'types/next'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { verifySession } from 'Admin/utils/firebase'
import { AdminHeader } from 'Admin/components/AdminHeader'

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
            <div className={classes.header}>
                <AdminHeader user={user} />
            </div>
            <Landing loggedIn={!!user} />
        </div>
    )
}

export default LandingPage
