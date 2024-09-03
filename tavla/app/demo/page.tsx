import {
    Heading1,
    Heading2,
    LeadParagraph,
    ListItem,
    Paragraph,
    UnorderedList,
} from '@entur/typography'
import { verifySession } from 'app/(admin)/utils/firebase'
import { cookies } from 'next/headers'
import { DemoBoard } from './components/DemoBoard'
import CreateUserButton from './components/CreateUserButton'

async function Demo() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null

    return (
        <main className="container pt-8 pb-20 flex flex-col gap-10">
            <div>
                <Heading1>Test ut Tavla!</Heading1>
                <LeadParagraph margin="none" className="lg:w-4/5">
                    Dette er en demo-løsning hvor du kan prøve å opprette din
                    egen tavle. Du må logge inn for å lagre tavlen og få tilgang
                    til all funksjonalitet. Tavlen du lager her blir ikke
                    lagret.
                </LeadParagraph>
            </div>
            {!loggedIn && <CreateUserButton />}

            <div className="flex flex-col gap-10">
                <DemoBoard />
            </div>
            <div>
                <Heading2>Innstillinger som krever innlogging</Heading2>
                <Paragraph margin="none">Hvis du logger inn, kan du:</Paragraph>
                <UnorderedList className="flex flex-col gap-1 pl-6">
                    <ListItem>Endre tekststørrelse</ListItem>
                    <ListItem>Endre fargetema (lys eller mørk modus)</ListItem>
                    <ListItem>
                        Legge til en info-melding nederst i tavlen
                    </ListItem>
                    <ListItem>
                        Vis gåavstanden fra tavlens adresse til stoppested(ene)
                    </ListItem>
                    <ListItem>
                        Opprette så mange tavler du vil, og samle disse i ulike
                        organisasjoner (mapper)
                    </ListItem>
                    <ListItem>
                        Gi andre tilgang til å administrere tavlen
                    </ListItem>
                </UnorderedList>
            </div>
        </main>
    )
}

export default Demo
