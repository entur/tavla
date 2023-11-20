import classes from 'styles/pages/admin.module.css'
import { cookies } from 'next/headers'
import {
    getOrganization,
    getOrganizationById,
    initializeAdminApp,
    verifySession,
} from 'Admin/utils/firebase'
import { permanentRedirect } from 'next/navigation'
import { Organization } from 'Admin/scenarios/Organization'
import { Metadata } from 'next'

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

    return (
        <div className={classes.root}>
            <Organization user={user} organization={organization} />
        </div>
    )
}

export default EditOrganizationPage
