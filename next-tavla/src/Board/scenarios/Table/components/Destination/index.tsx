import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'

function Destination() {
    const departures = useNonNullContext(DeparturesContext)

    const destinations = departures.map((departure) => ({
        destination: departure.destinationDisplay?.frontText ?? '',
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Destinasjon" className={classes.grow}>
            {destinations.map((destination) => (
                <TableRow key={destination.key}>
                    {destination.destination}
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Destination }
