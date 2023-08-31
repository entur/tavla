import { Header } from 'components/Header'
import { Edit } from 'Admin/scenarios/Edit'
import { TBoard } from 'types/settings'
import { getBoardSettings } from 'utils/firebase'
import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { upgradeBoard } from 'utils/converters'
import { ToastProvider } from '@entur/alert'
import { IncomingNextMessage } from 'types/next'
import { verifySession } from 'Admin/utils/firebase'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

export async function getServerSideProps({
    params,
    req,
}: {
    params: { id: string }
    req: IncomingNextMessage
}) {
    const { id } = params

    const session = req.cookies['session']
    const user = await verifySession(session)
    const settings: TBoard | undefined = await getBoardSettings(id)

    if (!settings) {
        return {
            notFound: true,
        }
    }

    const convertedSettings = upgradeBoard(settings)

    return {
        props: {
            user: user,
            settings: convertedSettings,
            id,
        },
    }
}

function AdminPage({
    user,
    settings,
    id,
}: {
    user: DecodedIdToken | null
    settings: TBoard
    id: string
}) {
    return (
        <Contrast className={classes.root}>
            <ToastProvider>
                <Header />
                <Edit initialSettings={settings} documentId={id} user={user} />
            </ToastProvider>
        </Contrast>
    )
}

export default AdminPage
