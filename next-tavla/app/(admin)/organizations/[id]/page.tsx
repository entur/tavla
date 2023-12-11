import classes from '../../admin.module.css'
import {
    getOrganization,
    getOrganizationById,
    getOrganizationUsers,
    initializeAdminApp,
} from 'Admin/utils/firebase'
import { Metadata } from 'next'
import { Heading1 } from '@entur/typography'
import { UploadLogo } from 'Admin/scenarios/Organization/components/UploadLogo'
import { MemberAdministration } from 'Admin/scenarios/Organization/components/MemberAdministration'
import { permanentRedirect } from 'next/navigation'
import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { Delete } from 'app/(admin)/components/Delete'

initializeAdminApp()

type TProps = {
    params: { id: string }
}

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
    const { id } = params

    const organization = await getOrganizationById(id)

    return {
        title: `${organization.name} | Entur Tavla`,
    }
}

async function EditOrganizationPage({ params }: TProps) {
    const { id } = params

    const user = await getUserFromSessionCookie()

    if (!user) permanentRedirect('/')

    const organization = await getOrganization(id)

    if (!organization || !organization?.owners?.includes(user.uid))
        return <div>Du har ikke tilgang til denne organisasjonen</div>

    const members = await getOrganizationUsers(user.uid, id)

    return (
        <div className={classes.root}>
            <div className="flexRow justifyBetween alignCenter">
                <Heading1>{organization.name}</Heading1>
                <Delete organization={organization} uid={user.uid} />
            </div>
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
