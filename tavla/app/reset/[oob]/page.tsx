import { Heading3 } from '@entur/typography'
import { ResetForm } from './ResetForm'

async function Reset(props: { params: Promise<{ oob: string }> }) {
    const params = await props.params
    return (
        <main className="container justify-center flex flex-col items-center mb-10">
            <Heading3>Tilbakestill passord</Heading3>
            <ResetForm oob={params.oob} />
        </main>
    )
}

export default Reset
