import { useNonNullContext } from 'hooks/useNonNullContext'
import { nanoid } from 'nanoid'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { DeparturesContext } from '../contexts'
import { TableColumn } from './TableColumn'
import { TableRow } from './TableRow'

function Destination() {
    const departures = useNonNullContext(DeparturesContext)

    const destinations = departures.map((departure) => ({
        destination: departure.destinationDisplay?.frontText ?? '',
        via:
            departure.destinationDisplay?.via
                ?.filter(isNotNullOrUndefined)
                .join(', ') ?? '',
        key: nanoid(),
    }))
    return (
        <div className="grow overflow-hidden">
            <TableColumn title="Destinasjon">
                {destinations.map((destination) => (
                    <TableRow
                        key={destination.key}
                        className="flex align-middle"
                    >
                        <div className="line-clamp-2 overflow-ellipsis hyphens-auto leading-em-base">
                            {destination.via
                                ? `${destination.destination} via ${destination.via}`
                                : destination.destination}
                        </div>
                    </TableRow>
                ))}
            </TableColumn>
        </div>
    )
}

function Name() {
    const departures = useNonNullContext(DeparturesContext)

    return (
        <div className="grow overflow-hidden">
            <TableColumn title="Stoppested">
                {departures.map((departure) => (
                    <TableRow key={nanoid()}>
                        <div className="line-clamp-2 justify-items-end overflow-ellipsis hyphens-auto text-em-base/em-base">
                            {departure.quay.name}
                        </div>
                    </TableRow>
                ))}
            </TableColumn>
        </div>
    )
}

export { Destination, Name }
