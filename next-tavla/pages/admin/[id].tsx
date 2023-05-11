import { Header } from 'components/Header'
import { Admin } from 'scenarios/Admin'
import { TSettings } from 'types/settings'
import { getBoardSettings } from 'utils/firebase'

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
        <div className="root" data-theme={settings.theme}>
            <div className="root-container">
                <Header theme={settings.theme} />
                <Admin initialSettings={settings} documentId={id} />
            </div>
        </div>
    )
}

export default AdminPage
