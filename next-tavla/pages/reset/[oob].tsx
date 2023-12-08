import { ToastProvider } from '@entur/alert'
import { Contrast } from '@entur/layout'
import { ResetPassword } from 'Admin/scenarios/ResetPassword'
import classes from 'styles/pages/admin.module.css'

export async function getServerSideProps({
    params,
}: {
    params: { oob: string }
}) {
    const { oob } = params

    if (!oob) {
        return {
            redirect: {
                destination: '/#login',
                permanent: false,
            },
        }
    }

    return {
        props: {
            oob: oob,
        },
    }
}

function ResetPasswordPage({ oob }: { oob: string }) {
    return (
        <Contrast className={classes.root}>
            <ToastProvider>
                <ResetPassword oob={oob} />
            </ToastProvider>
        </Contrast>
    )
}

export default ResetPasswordPage
