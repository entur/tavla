import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { verifyUserSession } from 'Admin/utils/auth'
import { IncomingNextMessage } from 'types/next'
import { AdminHeader } from 'Admin/components/AdminHeader'
import { Organizations } from 'Admin/scenarios/Organizations'

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

    return {
        props: {
            loggedIn: user !== null,
        },
    }
}

function OrganizationsPage({ loggedIn }: { loggedIn: boolean }) {
    return (
        <div className={classes.root}>
            <AdminHeader loggedIn={loggedIn} />
            <Contrast>
                <ToastProvider>
                    <Organizations />
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default OrganizationsPage
