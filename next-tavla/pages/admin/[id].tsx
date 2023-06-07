import { Header } from 'components/Header'
import { Admin } from 'Admin/index'
import { TSettings } from 'types/settings'
import { getBoardSettings } from 'utils/firebase'
import classes from 'styles/admin.module.css'
import { Contrast } from '@entur/layout'
import { convertSettingsVersion } from 'utils/converters'

export async function getServerSideProps({
    params,
}: {
    params: { id: string }
}) {
    const { id } = params

    const settings: TSettings | undefined = await getBoardSettings(id)

    if (!settings) {
        return {
            notFound: true,
        }
    }

    const convertedSettings = convertSettingsVersion(settings)

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
            <Header theme={settings.theme} />
            <Admin initialSettings={settings} documentId={id} />
        </Contrast>
    )
}

export default AdminPage
