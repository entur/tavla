import { Heading3 } from '@entur/typography'
import { ResetForm } from './ResetForm'

async function Tilbakestill(props: { params: Promise<{ oob: string }> }) {
    const params = await props.params
    return (
        <main className="container mb-10 flex flex-col items-center justify-center">
            <Heading3>Tilbakestill passord</Heading3>
            <ResetForm oob={params.oob} />
        </main>
    )
}

export default Tilbakestill
