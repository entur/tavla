import { Heading3 } from '@entur/typography'
import { ResetForm } from './ResetForm'

async function Reset(props: { params: Promise<{ oob: string }> }) {
    const params = await props.params
    return (
        <div className="flex sm:h-[50vh] flex-col items-center sm:justify-center mb-10">
            <Heading3 className="mt-8">Tilbakestill passord</Heading3>
            <ResetForm oob={params.oob} />
        </div>
    )
}

export default Reset
