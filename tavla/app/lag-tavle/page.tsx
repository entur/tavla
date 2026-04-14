import { Heading1, LeadParagraph } from '@entur/typography'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { CreateUserButton } from 'app/components/CreateUserButton'
import { NavigateToOversiktButton } from 'app/components/NavigateToOversiktButton'
import { FeatureFlags } from 'app/posthog/featureFlags'
import { isFeatureEnabled } from 'app/posthog/nodePosthogClient'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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

    return (
        <main
            id="main-content"
            className="container flex flex-col gap-6 pb-20 pt-8"
        >
            <div className="flex h-full items-center justify-between align-middle">
                <Heading1 className="!mb-0">Lag en tavle</Heading1>
                {!loggedIn ? (
                    <CreateUserButton />
                ) : (
                    <NavigateToOversiktButton />
                )}
            </div>
            <LeadParagraph margin="none">
                Tavlen du lager her blir lagret i nettleseren din.
            </LeadParagraph>
            <div className="flex flex-col gap-10">
                <CreateBoardLocally />
            </div>
        </main>
    )
}

export default LagTavlePage
