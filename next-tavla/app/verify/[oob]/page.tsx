import { getClientApp } from 'utils/firebase'
import { applyActionCode, getAuth } from 'firebase/auth'
import { Paragraph } from '@entur/typography'
import { Button } from '@entur/button'
import Link from 'next/link'
import { FirebaseError } from 'firebase/app'

async function Verify({ params }: { params: { oob: string } }) {
    let message = 'E-postadressen din er nå verifisert!'
    try {
        const app = await getClientApp()
        const auth = getAuth(app)
        await applyActionCode(auth, params.oob)
    } catch (e) {
        if (e instanceof FirebaseError) {
            switch (e.code) {
                case 'auth/expired-action-code':
                    message =
                        'Lenken du brukte for å verifisere kontoen din er utgått.'
                case 'auth/invalid-action-code':
                    message =
                        'Lenken du brukte for å verifisere kontoen din er ugyldig.'
                case 'auth/user-disabled':
                    message =
                        'Kontoen din er deaktivert og kunne ikke verifiseres.'
                case 'auth/user-not-found':
                    message = 'Fant ingen bruker som samsvarte med lenken.'
            }
        } else message = 'Noe gikk galt, prøv igjen senere.'
    }
    return (
        <div className="flex flex-col items-center eds-contrast pt-8">
            <Paragraph>{message}</Paragraph>
            <Button variant="primary" as={Link} href="/">
                Ta meg tilbake til landingsiden
            </Button>
        </div>
    )
}

export default Verify
