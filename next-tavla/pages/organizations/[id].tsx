import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { IncomingNextMessage } from 'types/next'
import { verifyUserSession } from 'Admin/utils/auth'
import { AdminHeader } from 'Admin/components/AdminHeader'
import { InviteUser } from 'Admin/scenarios/Organizations/components/InviteUser'
import { TOrganization } from 'types/settings'
import { getOrganization } from 'Admin/utils/firebase'
import { Heading1 } from '@entur/typography'

export async function getServerSideProps({
    params,
    req,
}: {
    params: { id: string }
    req: IncomingNextMessage
}) {
    const { id } = params

    const user = await verifyUserSession(req)

    if (!user)
        return {
            redirect: {
                destination: '/#login',
                permanent: false,
            },
        }

    const organization = await getOrganization(id)

    if (!organization || !organization?.owners?.includes(user.uid))
        return { notFound: true }

    return {
        props: {
            loggedIn: user !== null,
            organization,
        },
    }
}

function EditOrganizationPage({
    organization,
}: {
    organization: TOrganization
}) {
    return (
        <div className={classes.root}>
            <AdminHeader loggedIn />
            <Contrast>
                <ToastProvider>
                    <Heading1>{organization.name}</Heading1>
                    <InviteUser organization={organization} />
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default EditOrganizationPage
