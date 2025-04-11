import { Metadata } from 'next'
import { Heading1, LeadParagraph } from '@entur/typography'
import { redirect } from 'next/navigation'
import { UploadLogo } from '../../components/UploadLogo'
import { MemberAdministration } from '../../components/MemberAdministration'
import { getOrganizationIfUserHasAccess } from 'app/(admin)/actions'
import { initializeAdminApp } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { auth } from 'firebase-admin'
import { UidIdentifier } from 'firebase-admin/lib/auth/identifier'

initializeAdminApp()

type TProps = {
    params: Promise<{ id: string }>
}

export async function generateMetadata(props: TProps): Promise<Metadata> {
    const params = await props.params
    const { id } = params

    const organization = await getOrganizationIfUserHasAccess(id)

    return {
        title: `${organization?.name} | Entur Tavla`,
    }
}

async function EditOrganizationPage(props: TProps) {
    const params = await props.params
    const { id } = params

    const user = await getUserFromSessionCookie()

    if (!user) redirect('/')

    const organization = await getOrganizationIfUserHasAccess(id)

    if (!organization || !organization?.owners?.includes(user.uid))
        return <div>Du har ikke tilgang til denne mappen</div>

    const uids = organization.owners ?? []
    const usersReq = await auth().getUsers(
        uids.map(
            (uid) =>
                ({
                    uid,
                }) as UidIdentifier,
        ),
    )

    return (
        <div className="bg-gray-50">
            <div className="container pb-20 pt-16">
                <Heading1 margin="top">{organization.name}</Heading1>
                <LeadParagraph margin="bottom">
                    Valgene som tas blir satt som standard når det opprettes en
                    tavle i mappen &quot;{organization.name}&quot;.
                    Innstillingene vil ikke påvirke tavler som allerede har
                    blitt opprettet.
                </LeadParagraph>
                <div className="grid gap-y-12 gap-x-8 lg:grid-cols-2">
                    <MemberAdministration
                        members={usersReq.users}
                        uid={user.uid}
                        oid={organization.id}
                    />
                    <UploadLogo organization={organization} />
                </div>
            </div>
        </div>
    )
}

export default EditOrganizationPage
