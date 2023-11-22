import classes from '../admin.module.css'
import { Organizations } from 'Admin/scenarios/Organizations'
import { getOrganizationsWithUser, verifySession } from 'Admin/utils/firebase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Contrast } from 'Admin/components/Contrast'

async function OrganizationsPage() {
    const session = cookies().get('session')
    const user = await verifySession(session?.value)

    if (!user) redirect('/#login')

    const organizations = await getOrganizationsWithUser(user.uid)

    return (
        <div className={classes.root}>
            <Contrast>
                <Organizations
                    organizations={organizations}
                    userId={user.uid}
                />
            </Contrast>
        </div>
    )
}

export default OrganizationsPage
