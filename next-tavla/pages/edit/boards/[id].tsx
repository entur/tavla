import classes from 'styles/pages/admin.module.css'
import { Contrast } from '@entur/layout'
import { ToastProvider } from '@entur/alert'
import { Header } from 'components/Header'
import { Admin } from 'src/MyBoards/scenarios/Admin'
import { getBoardSettings } from 'utils/firebase'
import { TSettings } from 'types/settings'
import { upgradeSettings } from 'utils/converters'
import { checkFeatureFlags } from 'utils/featureFlags'

async function getBoards(ids: string[]) {
    const settingsPromises = ids.map(async (id: string) => {
        const settings = await getBoardSettings(id)
        return { id, settings }
    })

    const allSettingsWithIds = await Promise.all(settingsPromises)

    const convertedSettings = allSettingsWithIds.map(({ id, settings }) => {
        return {
            id,
            settings: settings ? upgradeSettings(settings) : null,
        }
    })

    return convertedSettings
}

export async function getServerSideProps() {
    const featureFlag = await checkFeatureFlags('BOARDS')
    if (!featureFlag) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    //when login is fixed:
    // 1. take user id as params
    // 2. create getBoards function in firebase.ts that gets all boards for a user based on user id
    // 3. use getBoards function instead of getBoardSettings to get all boards for a user
    // 4. remove ids const
    const ids = [
        'Malre1Dx5zLE086AzpFH',
        'oMgfeCRUZ4sfD8xXXG8M',
        '8EyKHHP5Ie2HisOO2ilt',
    ]

    const boards = await getBoards(ids)

    return {
        props: {
            boards: boards,
        },
    }
}

function OverviewPage({
    boards,
}: {
    boards: { id: string; settings: TSettings | undefined }[]
}) {
    return (
        <Contrast className={classes.root}>
            <ToastProvider>
                <Header />
                <Admin boards={boards} />
            </ToastProvider>
        </Contrast>
    )
}

export default OverviewPage
