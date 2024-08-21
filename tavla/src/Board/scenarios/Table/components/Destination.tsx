import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../contexts'
import { Situations } from './Situations'
import { TableColumn } from './TableColumn'
import { TableRow } from './TableRow'
import { isNotNullOrUndefined } from 'utils/typeguards'

function Destination({ deviations = true }: { deviations?: boolean }) {
    const departures = useNonNullContext(DeparturesContext)

    const destinations = departures.map((departure) => ({
        destination: departure.destinationDisplay?.frontText ?? '',
        situations: departure.situations ?? [],
        via:
            departure.destinationDisplay?.via
                ?.filter(isNotNullOrUndefined)
                .join(', ') ?? '',
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
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

export { Destination }
