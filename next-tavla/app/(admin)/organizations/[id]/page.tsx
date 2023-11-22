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
import { permanentRedirect } from 'next/navigation'
import { Metadata } from 'next'
import { Contrast } from 'Admin/components/Contrast'
import { Heading1 } from '@entur/typography'
import { UploadLogo } from 'Admin/scenarios/Organization/components/UploadLogo'
import { MemberAdministration } from 'Admin/scenarios/Organization/components/MemberAdministration'

initializeAdminApp()

type Props = {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = params

    const organization = await getOrganizationById(id)

    return {
        title: `${organization.name} | Entur Tavla`,
    }
}

async function EditOrganizationPage({ params }: Props) {
    const { id } = params

    const session = cookies().get('session')
    const user = await verifySession(session?.value)

    if (!user) permanentRedirect('/')

    const organization = await getOrganization(id)

    if (!organization || !organization?.owners?.includes(user.uid))
        return <div>Du har ikke tilgang til denne organisasjonen</div>

    const userIds = await getOrganizationUsers(id ?? '')
    const members = await getUsersWithEmailsByUids(userIds)

    return (
        <div className={classes.root}>
            <Contrast>
                <Heading1>{organization.name}</Heading1>
            </Contrast>
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
