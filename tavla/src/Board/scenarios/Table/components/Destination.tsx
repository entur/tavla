import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../contexts'
import { Situations } from './Situations'
import { TableColumn } from './TableColumn'
import { TableRow } from './TableRow'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { nanoid } from 'nanoid'

function Destination({ deviations = true }: { deviations?: boolean }) {
    const departures = useNonNullContext(DeparturesContext)

    const destinations = departures.map((departure) => ({
        destination: departure.destinationDisplay?.frontText ?? '',
        situations: departure.situations ?? [],
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
                    <TableRow key={destination.key}>
                        <div className="truncate">
                            {destination.via
                                ? `${destination.destination} via ${destination.via}`
                                : destination.destination}
                        </div>

                        {deviations && (
                            <Situations situations={destination.situations} />
                        )}
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
                        <div className="justify-items-end">
                            {departure.quay.name}
                        </div>
                    </TableRow>
                ))}
            </TableColumn>
        </div>
    )
}

export { Destination, Name }
