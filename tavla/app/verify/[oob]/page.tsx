import { getClientApp } from 'utils/firebase'
import { applyActionCode, getAuth } from 'firebase/auth'
import { Paragraph } from '@entur/typography'
import { Button } from '@entur/button'
import Link from 'next/link'
import { FirebaseError } from 'firebase/app'

async function Verify(props: { params: Promise<{ oob: string }> }) {
    const params = await props.params
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
                    message =
                        'Det kan hende at e-posten din ikke ble verifisert. Prøv å logge inn. Hvis dette funker, er alt som det skal. Hvis ikke, sender vi en ny e-post for verifisering.'
            }
        } else message = 'Noe gikk galt, prøv igjen senere.'
    }
    return (
        <main className="container pt-8 pb-20 text-center">
            <Paragraph>{message}</Paragraph>
            <Button variant="primary" as={Link} href="/?login">
                Logg inn
            </Button>
        </main>
    )
}

export default Verify
