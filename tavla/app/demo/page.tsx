import { Heading1, LeadParagraph } from '@entur/typography'
import { DemoBoard } from './components/DemoBoard'
import { ExpandableInformation } from './components/ExpandableInformation'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { CreateUserButton } from 'app/components/CreateUserButton'

async function Demo() {
    const loggedIn = (await getUserFromSessionCookie()) !== null

    return (
        <main className="container pt-8 pb-20 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Heading1>Test ut Tavla!</Heading1>
                {!loggedIn && <CreateUserButton />}
            </div>
            <LeadParagraph margin="none">
                Dette er en demo-løsning hvor du kan prøve å opprette din egen
                tavle. Du må logge inn for å lagre tavlen og få tilgang til all
                funksjonalitet. Tavlen du lager her blir ikke lagret.
            </LeadParagraph>
            <ExpandableInformation />
            <div className="flex flex-col gap-10">
                <DemoBoard />
            </div>
        </main>
    )
}

export default Demo
