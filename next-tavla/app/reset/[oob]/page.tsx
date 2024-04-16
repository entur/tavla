import { Heading3 } from '@entur/typography'
import { ResetForm } from './ResetForm'

function Reset({ params }: { params: { oob: string } }) {
    return (
        <div className="flex flex-col items-center eds-contrast">
            <Heading3 className="mt-8 mr-2">Tilbakestill passord</Heading3>
            <ResetForm oob={params.oob} />
        </div>
    )
}

export default Reset
