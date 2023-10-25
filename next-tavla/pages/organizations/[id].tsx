import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { IncomingNextMessage } from 'types/next'
import { verifyUserSession } from 'Admin/utils/auth'
import { AdminHeader } from 'Admin/components/AdminHeader'

export async function getServerSideProps({
    params,
    req,
}: {
    params: { id: string }
    req: IncomingNextMessage
}) {
    const { id } = params

    const loggedIn = (await verifyUserSession(req)) !== null

    if (!loggedIn)
        return {
            redirect: {
                destination: '/#login',
                permanent: false,
            },
        }

    return {
        props: {
            id,
        },
    }
}

function EditOrganizationPage({ id }: { id: string }) {
    return (
        <div className={classes.root}>
            <AdminHeader loggedIn={true} />
            <Contrast>
                <ToastProvider>
                    <div>{id}</div>
                </ToastProvider>
            </Contrast>
        </div>
    )
}

export default EditOrganizationPage
