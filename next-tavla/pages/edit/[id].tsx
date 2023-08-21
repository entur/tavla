import { Header } from 'components/Header'
import { Edit } from 'Admin/scenarios/Edit'
import { TSettings } from 'types/settings'
import { getBoardSettings } from 'utils/firebase'
import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { upgradeSettings } from 'utils/converters'
import { ToastProvider } from '@entur/alert'
import { IncomingNextMessage } from 'types/next'

export async function getServerSideProps({
    params,
    req,
}: {
    params: { id: string }
    req: IncomingNextMessage
}) {
    const { id } = params

    const session = req.cookies['session']
    console.log(session)
    const settings: TSettings | undefined = await getBoardSettings(id)

    if (!settings) {
        return {
            notFound: true,
        }
    }

    const convertedSettings = upgradeSettings(settings)

    return {
        props: {
            settings: convertedSettings,
            id,
        },
    }
}

function AdminPage({ settings, id }: { settings: TSettings; id: string }) {
    return (
        <Contrast className={classes.root}>
            <ToastProvider>
                <Header />
                <Edit initialSettings={settings} documentId={id} />
            </ToastProvider>
        </Contrast>
    )
}

export default AdminPage
