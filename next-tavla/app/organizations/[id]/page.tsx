import classes from 'styles/pages/admin.module.css'
import { cookies } from 'next/headers'
import { verifySession } from 'Admin/utils/firebase'
import { permanentRedirect } from 'next/navigation'

async function EditOrganizationPage({ params }: { params: { id: string } }) {
    const { id } = params

    const session = cookies().get('session')
    const loggedIn = await verifySession(session?.value)

    if (!loggedIn) permanentRedirect('/')

    return (
        <div className={classes.root}>
            <div>{id}</div>
        </div>
    )
}

export default EditOrganizationPage
