import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'

function Via() {
    const departures = useNonNullContext(DeparturesContext)

    const vias = departures.map((departure) => ({
        via:
            departure.destinationDisplay?.via
                ?.filter(isNotNullOrUndefined)
                .join(', ') ?? '',
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Via" className={classes.shrink}>
            {vias.map((via) => (
                <TableRow key={via.key}>{via.via}</TableRow>
            ))}
        </TableColumn>
    )
}

export { Via }
