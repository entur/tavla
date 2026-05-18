import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import { FeatureFlags } from 'app/posthog/featureFlags'
import { isFeatureEnabled } from 'app/posthog/nodePosthogClient'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CreateBoardLocally } from './components/CreateBoardLocally'

export const metadata: Metadata = {
    title: 'Lag en tavle | Entur Tavla - Sanntidsskjerm og avgangstavle for offentlig transport',
    description: 'Opprett din egen tavle uten å logge inn.',
}

async function LagTavlePage() {
    const flagEnabled = await isFeatureEnabled(
        FeatureFlags.CreateBoardWithoutUser,
    )
    if (!flagEnabled) notFound()

    const loggedIn = (await getUserFromSessionCookie()) !== null
    if (loggedIn) redirect('/oversikt')

    return (
        <main
            id="main-content"
            className="container flex flex-col gap-6 pb-20 pt-8"
        >
            <CreateBoardLocally />
        </main>
    )
}

export default LagTavlePage
