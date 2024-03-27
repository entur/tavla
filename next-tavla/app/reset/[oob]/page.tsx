import { Heading3 } from '@entur/typography'
import { ResetForm } from './ResetForm'

function Reset({ params }: { params: { oob: string } }) {
    return (
        <div className="flexColumn alignCenter eds-contrast">
            <Heading3 className="mt-4 mb-1">Tilbakestill passord</Heading3>
            <ResetForm oob={params.oob} />
        </div>
    )
}

export default Reset
