import classes from '../../admin.module.css'
import {
    getOrganizationById,
    getOrganizationUsers,
    initializeAdminApp,
} from 'Admin/utils/firebase'
import { Metadata } from 'next'
import { Heading1, LeadParagraph } from '@entur/typography'
import { permanentRedirect } from 'next/navigation'
import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { Delete } from 'app/(admin)/components/Delete/index'
import { UploadLogo } from '../components/UploadLogo'
import { MemberAdministration } from '../components/MemberAdministration'
import { CountiesSelect } from '../components/MemberAdministration/CountiesSelect'
import { FontSelect } from '../components/FontSelect'
import { DefaultColumns } from '../components/DefaultColumns'
import { getOrganization } from 'app/(admin)/actions'

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
                <Delete organization={organization} type="secondary" />
            </div>
            <LeadParagraph>
                Valgene som tas blir satt som standard når det opprettes en
                tavle i organisasjonen &quot;{organization.name}&quot;. Valgene
                kan fortsatt justeres i hver enkelt tavle med unntak av logo.
            </LeadParagraph>
            <div className={classes.organization}>
                <MemberAdministration
                    members={members}
                    uid={user.uid}
                    oid={organization.id}
                />

                <CountiesSelect
                    oid={organization.id}
                    countiesList={organization?.defaults?.counties}
                />
                <DefaultColumns
                    oid={organization.id}
                    columns={organization.defaults?.columns}
                />

                <FontSelect
                    oid={organization.id}
                    font={organization?.defaults?.font}
                />

                <UploadLogo organization={organization} />
            </div>
        </div>
    )
}

export default EditOrganizationPage
