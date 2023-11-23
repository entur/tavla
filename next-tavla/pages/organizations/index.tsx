import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { verifyUserSession } from 'Admin/utils/auth'
import { IncomingNextMessage } from 'types/next'
import { AdminHeader } from 'Admin/components/AdminHeader'
import { Organizations } from 'Admin/scenarios/Organizations'
import { getOrganizationsWithUser } from 'Admin/utils/firebase'
import { TOrganization, TUserID } from 'types/settings'
import TavlaHead from 'components/TavlaHead'

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
            organizations: await getOrganizationsWithUser(user.uid),
            userId: user.uid,
        },
    }
}

function OrganizationsPage(props: {
    organizations: TOrganization[]
    userId: TUserID
}) {
    return (
        <div className={classes.root}>
            <TavlaHead
                title="Organisasjoner"
                description="Oversikt over organisasjonene du er med i"
            />
            <AdminHeader loggedIn />
            <Contrast>
                <ToastProvider>
                    <Organizations {...props} />
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default OrganizationsPage
