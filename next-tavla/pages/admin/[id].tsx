import { Header } from 'scenarios/Header'
import { Admin } from 'scenarios/Admin'
import { TSettings } from 'types/settings'
import { getBoardSettings } from 'utils/firebase'
import classes from './styles.module.css'

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

    return {
        props: {
            settings,
            id,
        },
    }
}

function AdminPage({ settings, id }: { settings: TSettings; id: string }) {
    return (
        <div className={classes.root}>
            <Header theme={settings.theme} />
            <Admin initialSettings={settings} documentId={id} />
        </div>
    )
}

export default AdminPage
