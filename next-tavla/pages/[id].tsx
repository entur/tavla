import { Header } from 'components/Header'
import { TSettings } from 'types/settings'
import { getBoardSettings } from 'utils/firebase'
import classes from 'styles/pages/board.module.css'
import { convertSettingsVersion } from 'utils/converters'
import { Board } from 'Board/scenarios/Board'
import { FooterText } from 'Board/scenarios/Footer'

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
        },
    }
}

function BoardPage({ settings }: { settings: TSettings }) {
    return (
        <div className={classes.root} data-theme={settings.theme || 'dark'}>
            <div className={classes.rootContainer}>
                <Header theme={settings.theme} />
                <Board settings={settings} />
                <FooterText text={settings.footer} />
            </div>
        </div>
    )
}

export default BoardPage
