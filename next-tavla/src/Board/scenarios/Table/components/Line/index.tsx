import { useNonNullContext } from 'hooks/useNonNullContext'
import { getPresentation } from 'utils/colors'
import { TransportIcon } from '../TransportIcon'
import { DepartureContext } from '../../contexts'

function Line() {
    const departure = useNonNullContext(DepartureContext)

    const presentation = getPresentation(
        departure.serviceJourney.line.presentation,
        departure.serviceJourney.line.id,
        departure.serviceJourney.transportMode,
    )

    return (
        <td>
            <TransportIcon
                transportMode={departure.serviceJourney.transportMode}
                publicCode={departure.serviceJourney.line.publicCode}
                presentation={presentation}
            />
        </td>
    )
}
export { Line }
