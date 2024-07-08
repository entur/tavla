import { Button } from '@entur/button'
import {
    Heading1,
    Heading2,
    Heading3,
    LeadParagraph,
    ListItem,
    Paragraph,
    UnorderedList,
} from '@entur/typography'
import { verifySession } from 'app/(admin)/utils/firebase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { DemoBoard } from './components/DemoBoard'
import { usePostHog } from 'posthog-js/react'

async function Demo() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null

    return (
        <main className="container mx-auto pt-8 pb-20 flex flex-col gap-10">
            <div>
                <Heading1>Prøv og lag din egen avgangstavle!</Heading1>
                <LeadParagraph margin="none" className="lg:w-4/5">
                    Dette er en demo-løsning hvor du kan prøve å opprette din
                    egen tavle. Du må logge inn for å lagre tavlen og få tilgang
                    til all funksjonalitet. Tavlen du lager her blir ikke
                    lagret.
                </LeadParagraph>
            </div>
            {!loggedIn && <CreateUserButton />}

            <div className="flex flex-col gap-10">
                <Heading1 margin="none">Lag en demo-tavle</Heading1>
                <DemoBoard />
            </div>
            <div>
                <Heading2>Innstillinger som krever innlogging</Heading2>
                <Paragraph margin="none">Hvis du logger inn, kan du:</Paragraph>
                <UnorderedList className="flex flex-col gap-1 pl-6">
                    <ListItem>Endre tekststørrelse</ListItem>
                    <ListItem>
                        Legge til en info-melding nederst i tavlen
                    </ListItem>
                    <ListItem>Endre fargetema (lys eller mørk modus)</ListItem>
                    <ListItem>
                        Legge inn adressen som tavlen står på og vise gåavstand
                        fra tavlen til stoppested(ene)
                    </ListItem>
                    <ListItem>
                        Opprette så mange tavler du vil og samle disse i ulike
                        organisasjoner (mapper)
                    </ListItem>
                    <ListItem>
                        Gi andre tilgang til å administrere tavlen
                    </ListItem>
                </UnorderedList>
            </div>
            {!loggedIn && <CreateUserButton />}
        </main>
    )
}

export default Demo

const CreateUserButton = () => {
    const posthog = usePostHog()

    return (
        <div>
            <Heading3 margin="bottom">Opprett bruker</Heading3>
            <Paragraph margin="none">
                Det er helt gratis å bruke Tavla!
            </Paragraph>
            <Button
                variant="success"
                as={Link}
                href="?login"
                className="mt-2"
                onClick={() => {
                    posthog.capture('LOGIN_BTN_DEMO_PAGE')
                }}
            >
                Opprett bruker / Logg inn
            </Button>
        </div>
    )
}
