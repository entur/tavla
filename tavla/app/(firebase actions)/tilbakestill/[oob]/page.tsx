import { Heading3 } from '@entur/typography'
import type { Metadata } from 'next'
import { ResetForm } from './ResetForm'

export const metadata: Metadata = {
    title: 'Tilbakestill passord | Entur Tavla - Sanntidsskjerm og avgangstavle for offentlig transport',
    description: 'Velg et nytt passord for brukeren din i Entur Tavla.',
}

async function Tilbakestill(props: { params: Promise<{ oob: string }> }) {
    const params = await props.params
    return (
        <main
            id="main-content"
            className="container mb-10 flex flex-col items-center justify-center"
        >
            <Heading3>Tilbakestill passord</Heading3>
            <ResetForm oob={params.oob} />
        </main>
    )
}

export default Tilbakestill
