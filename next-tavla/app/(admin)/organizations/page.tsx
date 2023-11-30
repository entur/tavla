import classes from '../admin.module.css'
import { Organizations } from 'Admin/scenarios/Organizations'
import { getOrganizationsWithUser, verifySession } from 'Admin/utils/firebase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function OrganizationsPage() {
    const session = cookies().get('session')
    const user = await verifySession(session?.value)

    if (!user) redirect('/#login')

    const organizations = await getOrganizationsWithUser(user.uid)

    return (
        <div className={classes.root}>
            <Organizations organizations={organizations} userId={user.uid} />
        </div>
    )
}

export default OrganizationsPage
