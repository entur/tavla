import { Heading1, LeadParagraph } from '@entur/typography'
import { DemoBoard } from './components/DemoBoard'
import { ExpandableInformation } from './components/ExpandableInformation'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { CreateUserButton } from 'app/components/CreateUserButton'
import { NavigateToFoldersAndBoardsPageButton } from 'app/components/NavigateToFoldersAndBoardsPageButton'

async function Demo() {
    const loggedIn = (await getUserFromSessionCookie()) !== null

    return (
        <main className="container pt-8 pb-20 flex flex-col gap-6">
            <div className="flex items-center justify-between align-middle h-full">
                <Heading1 className="!mb-0">Test ut Tavla</Heading1>
                {!loggedIn ? (
                    <CreateUserButton trackingEvent="LOGIN_BTN_DEMO_PAGE" />
                ) : (
                    <NavigateToFoldersAndBoardsPageButton />
                )}
            </div>
            <LeadParagraph margin="none">
                Dette er en demo-løsning hvor du kan prøve å opprette din egen
                tavle. Tavlen du lager her blir ikke lagret.
            </LeadParagraph>{' '}
            {!loggedIn && (
                <LeadParagraph margin="none">
                    Du må logge inn for å lagre tavlen og få tilgang til all
                    funksjonalitet.
                </LeadParagraph>
            )}
            {!loggedIn && <ExpandableInformation />}
            <div className="flex flex-col gap-10">
                <DemoBoard />
            </div>
        </main>
    )
}

export default Demo
