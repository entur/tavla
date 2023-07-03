import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from 'Board/scenarios/Table/contexts'
import { isNotNullOrUndefined } from 'utils/typeguards'

function Via() {
    const departure = useNonNullContext(DepartureContext)

    const viaDestinations = departure.destinationDisplay?.via
        ?.filter(isNotNullOrUndefined)
        .join(', ')

    return <td>{viaDestinations}</td>
}

export { Via }
