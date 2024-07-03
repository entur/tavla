import { Button } from '@entur/button'
import { Heading1, Paragraph, StrongText } from '@entur/typography'
import { verifySession } from 'app/(admin)/utils/firebase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { DemoBoard } from './components/DemoBoard'

async function Demo() {
    const session = cookies().get('session')?.value
    const loggedIn = (await verifySession(session)) !== null

    return (
        <main className="container mx-auto pt-8 pb-20">
            <Heading1>Prøv og lag din egen avgangstavle</Heading1>
            <Paragraph>
                Her kan du prøve å opprette din egen tavle for å se hvordan det
                kan se ut hos deg. For å få full tilgang til all funksjonalitet
                må du opprette en bruker.
            </Paragraph>
            <Paragraph>
                <StrongText>OBS! Tavlen vil ikke bli lagret.</StrongText>
            </Paragraph>
            {!loggedIn && (
                <Button
                    variant="primary"
                    as={Link}
                    href="?login"
                    className="mb-8"
                >
                    Opprett bruker
                </Button>
            )}

            <DemoBoard />
        </main>
    )
}

export default Demo
