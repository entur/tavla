import { Heading1, LeadParagraph } from '@entur/typography'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { CreateUserButton } from 'app/components/CreateUserButton'
import { FeatureFlags } from 'app/posthog/featureFlags'
import { isFeatureEnabled } from 'app/posthog/nodePosthogClient'
import { Metadata } from 'next'
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
                <div className="flex flex-row gap-4">
                    {!loggedIn && <CreateUserButton variant="secondary" />}
                </div>
            </div>
            <LeadParagraph margin="none">
                Søk opp din adresse eller ditt nærmeste stoppested og lag en
                tavle med avganger i nærheten. Legg til så mange stoppesteder du
                vil, og tilpass tavlen slik du ønsker. For å tilpasse hvilke
                avganger som vises kan du redigere dette etter du har lagt det
                til.
                <br /> <br />
                Når du er fornøyd med tavla kan du klikke på "Del tavla" og få
                en lenke du kan dele med andre, eller vise på en skjerm.
            </LeadParagraph>
            <div className="flex flex-col gap-10">
                <CreateBoardLocally />
            </div>
        </main>
    )
}

export default LagTavlePage
