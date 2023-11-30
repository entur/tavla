import classes from '../../admin.module.css'
import { cookies } from 'next/headers'
import {
    getOrganization,
    getOrganizationById,
    getOrganizationUsers,
    getUsersWithEmailsByUids,
    initializeAdminApp,
    verifySession,
} from 'Admin/utils/firebase'
import { Metadata } from 'next'
import { Heading1 } from '@entur/typography'
import { UploadLogo } from 'Admin/scenarios/Organization/components/UploadLogo'
import { MemberAdministration } from 'Admin/scenarios/Organization/components/MemberAdministration'
import { notFound, permanentRedirect } from 'next/navigation'

initializeAdminApp()

type TProps = {
    params: { id: string }
}

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
    const { id } = params

    const organization = await getOrganizationById(id)

    if (!organization)
        return {
            title: '404',
            description: 'Fant ikke organisasjonen',
        }

    return {
        title: organization.name,
        description: `Gjør endringer på organisasjonen "${organization.name}"`,
    }
}

async function EditOrganizationPage({ params }: TProps) {
    const { id } = params

    const session = cookies().get('session')
    const user = await verifySession(session?.value)

    if (!user) permanentRedirect('/')

    const organization = await getOrganization(id)

    if (!organization || !organization?.owners?.includes(user.uid)) notFound()

    const userIds = await getOrganizationUsers(id ?? '')
    const members = await getUsersWithEmailsByUids(userIds)

    return (
        <div className={classes.root}>
            <Heading1>{organization.name}</Heading1>
            <div className={classes.organization}>
                <UploadLogo organization={organization} />
                <MemberAdministration
                    members={members}
                    uid={user.uid}
                    oid={organization.id}
                />
            </div>
        </div>
    )
}

export default EditOrganizationPage
