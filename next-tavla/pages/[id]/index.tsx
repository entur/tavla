import { Board } from 'scenarios/Board'
import { Header } from 'components/Header'
import { TSettings } from 'types/settings'
import { getBoardSettings } from 'utils/firebase'
import classes from 'styles/board.module.css'

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
        },
    }
}

function BoardPage({ settings }: { settings: TSettings }) {
    return (
        <div className={classes.root} data-theme={settings.theme}>
            <div className={classes.rootContainer}>
                <Header theme={settings.theme} />
                <Board settings={settings} />
            </div>
        </div>
    )
}

export default BoardPage
