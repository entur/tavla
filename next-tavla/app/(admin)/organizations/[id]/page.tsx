import classes from '../../admin.module.css'
import {
    getOrganization,
    getOrganizationById,
    getOrganizationUsers,
    initializeAdminApp,
} from 'Admin/utils/firebase'
import { Metadata } from 'next'
import { Heading1, Heading3, Paragraph } from '@entur/typography'
import { permanentRedirect } from 'next/navigation'
import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { Delete } from 'app/(admin)/components/Delete'
import { UploadLogo } from '../components/UploadLogo'
import { MemberAdministration } from '../components/MemberAdministration'
import { CountiesSelect } from '../components/MemberAdministration/CountiesSelect'

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
                <Delete organization={organization} showText />
            </div>
            <div className={classes.organization}>
                <UploadLogo organization={organization} />
                <div>
                    <Heading3>
                        Velg fylke/fylker du skal sette opp tavler for
                    </Heading3>
                    <Paragraph>
                        Når du søker etter stoppesteder vil du søke i alle
                        fylker. Her kan du velge hvilke fylker du ønsker å
                        begrense søket til.
                    </Paragraph>
                    <CountiesSelect
                        oid={organization.id}
                        countiesList={organization.counties}
                    />
                </div>
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
