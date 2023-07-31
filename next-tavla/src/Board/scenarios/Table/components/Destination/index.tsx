import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { Situations } from '../Situations'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'

function Destination() {
    const departures = useNonNullContext(DeparturesContext)

    const destinations = departures.map((departure) => ({
        destination: departure.destinationDisplay?.frontText ?? '',
        situations: departure.situations ?? [],
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Destinasjon" className={classes.grow}>
            {destinations.map((destination) => (
                <TableRow key={destination.key}>
                    {destination.destination}
                    <Situations situations={destination.situations} />
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Destination }
