import { getClientApp } from 'utils/firebase'
import { applyActionCode, getAuth } from 'firebase/auth'
import { Paragraph } from '@entur/typography'
import { Button } from '@entur/button'
import Link from 'next/link'

async function Verify({ params }: { params: { oob: string } }) {
    let message = 'E-postadressen din er nå verifisert!'
    try {
        const app = await getClientApp()
        const auth = getAuth(app)
        await applyActionCode(auth, params.oob)
    } catch {
        message = 'Noe gikk galt, prøv igjen senere.'
    }
    return (
        <div className="flexColumn alignCenter eds-contrast pt-4">
            <Paragraph>{message}</Paragraph>
            <Button variant="primary" as={Link} href="/">
                Ta meg tilbake til landingsiden
            </Button>
        </div>
    )
}

export default Verify
