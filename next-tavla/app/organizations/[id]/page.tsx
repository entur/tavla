import classes from 'styles/pages/admin.module.css'
import { cookies } from 'next/headers'
import {
    getOrganization,
    initializeAdminApp,
    verifySession,
} from 'Admin/utils/firebase'
import { permanentRedirect } from 'next/navigation'
import { Organization } from 'Admin/scenarios/Organization'

initializeAdminApp()

async function EditOrganizationPage({ params }: { params: { id: string } }) {
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
