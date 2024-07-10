import { getClientApp } from 'utils/firebase'
import { applyActionCode, getAuth } from 'firebase/auth'
import { Paragraph } from '@entur/typography'
import { Button } from '@entur/button'
import Link from 'next/link'
import { FirebaseError } from 'firebase/app'

async function Verify({ params }: { params: { oob: string } }) {
    let message = 'E-postadressen din er nå verifisert!'
    const app = await getClientApp()
    const auth = getAuth(app)

    try {
        await applyActionCode(auth, params.oob)
    } catch (e) {
        // Check manually if email is verified
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${app.options.apiKey}`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oobCode: params.oob,
            }),
        })
        let emailVerified = false
        if (response.ok) {
            const data = await response.json()
            emailVerified = data.emailVerified
        }

        if (e instanceof FirebaseError && !emailVerified) {
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
                default:
                    message = 'Noe gikk galt, prøv igjen senere.'
            }
        }
    }
    return (
        <main className="container mx-auto pt-8 pb-20 text-center">
            <Paragraph>{message}</Paragraph>
            <Button variant="primary" as={Link} href="/?login">
                Logg inn
            </Button>
        </main>
    )
}

export default Verify
