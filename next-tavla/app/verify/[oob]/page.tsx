import { getClientApp } from 'utils/firebase'
import { applyActionCode, getAuth } from 'firebase/auth'
import { Paragraph } from '@entur/typography'

async function Verify({ params }: { params: { oob: string } }) {
    try {
        const app = await getClientApp()
        const auth = getAuth(app)
        await applyActionCode(auth, params.oob)
    } catch {
        return <Paragraph>Noe gikk galt, prøv igjen senere</Paragraph>
    }
    return <Paragraph>E-postadressen din er nå verifisert!</Paragraph>
}

export default Verify
