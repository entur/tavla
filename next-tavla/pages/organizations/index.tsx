import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { verifyUserSession } from 'Admin/utils/auth'
import { IncomingNextMessage } from 'types/next'
import { AdminHeader } from 'Admin/components/AdminHeader'
import { Organizations } from 'Admin/scenarios/Organizations'
import { getOrganizationsWithUser } from 'Admin/utils/firebase'
import { TOrganization, TUserID } from 'types/settings'
import { UserOrganizationsContext } from 'Admin/scenarios/Organizations/utils/context'

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
            organizations: await getOrganizationsWithUser(user.uid),
            userId: user.uid,
        },
    }
}

function OrganizationsPage({
    loggedIn,
    organizations,
    userId,
}: {
    loggedIn: boolean
    organizations: TOrganization[]
    userId: TUserID
}) {
    return (
        <div className={classes.root}>
            <AdminHeader loggedIn={loggedIn} />
            <Contrast>
                <ToastProvider>
                    <UserOrganizationsContext.Provider
                        value={{ userId, organizations }}
                    >
                        <Organizations />
                    </UserOrganizationsContext.Provider>
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default OrganizationsPage
