import { Heading1, LeadParagraph } from '@entur/typography'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { CreateUserButton } from 'app/components/CreateUserButton'
import { NavigateToOversiktButton } from 'app/components/NavigateToOversiktButton'
import { DemoBoard } from './components/DemoBoard'
import { ExpandableInformation } from './components/ExpandableInformation'

async function Demo() {
    const loggedIn = (await getUserFromSessionCookie()) !== null

    return (
        <main
            id="main-content"
            className="container flex flex-col gap-6 pb-20 pt-8"
        >
            <div className="flex h-full items-center justify-between align-middle">
                <Heading1 className="!mb-0">Test ut Tavla</Heading1>
                {!loggedIn ? (
                    <CreateUserButton trackingEvent="LOGIN_BTN_DEMO_PAGE" />
                ) : (
                    <NavigateToOversiktButton />
                )}
            </div>
            <LeadParagraph margin="none">
                Dette er en demo-løsning hvor du kan prøve å opprette din egen
                tavle. Tavlen du lager her blir ikke lagret.
            </LeadParagraph>
            {!loggedIn && (
                <>
                    <LeadParagraph margin="none">
                        Du må logge inn for å lagre tavlen og få tilgang til all
                        funksjonalitet.
                    </LeadParagraph>
                    <ExpandableInformation />
                </>
            )}
            <div className="flex flex-col gap-10">
                <DemoBoard />
            </div>
        </main>
    )
}

export default Demo
