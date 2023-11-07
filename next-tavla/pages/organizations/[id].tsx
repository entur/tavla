import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { IncomingNextMessage } from 'types/next'
import { verifyUserSession } from 'Admin/utils/auth'
import { AdminHeader } from 'Admin/components/AdminHeader'
import { TOrganizationID, TUserID } from 'types/settings'
import { getOrganizationById } from 'Admin/utils/firebase'
import { Heading1 } from '@entur/typography'
import { MemberAdministration } from 'Admin/scenarios/Organizations/components/MemberAdministration'

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

    const organization = await getOrganizationById(id)
    if (
        !organization ||
        !organization.id ||
        !organization?.owners?.includes(user.uid)
    )
        return { notFound: true }

    return {
        props: {
            oid: organization.id,
            uid: user.uid,
            name: organization.name,
        },
    }
}

function EditOrganizationPage({
    oid,
    uid,
    name,
}: {
    oid: TOrganizationID
    uid: TUserID
    name: string
}) {
    return (
        <div className={classes.root}>
            <AdminHeader loggedIn />
            <Contrast>
                <ToastProvider>
                    <Heading1>{name}</Heading1>
                    <MemberAdministration uid={uid} oid={oid} />
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default EditOrganizationPage
