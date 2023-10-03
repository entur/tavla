import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { Situations } from '../Situations'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'
import { isNotNullOrUndefined } from 'utils/typeguards'

function Destination() {
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
        <TableColumn title="Destinasjon" className={classes.grow}>
            {destinations.map((destination) => (
                <TableRow key={destination.key}>
                    {destination.via
                        ? `${destination.destination} via ${destination.via}`
                        : destination.destination}

                    <Situations situations={destination.situations} />
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Destination }
