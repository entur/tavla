import { useNonNullContext } from 'hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'

function Line() {
    const departures = useNonNullContext(DeparturesContext)

    const lines = departures.map((departure) => ({
        transportMode: departure.serviceJourney.transportMode ?? 'unknown',
        publicCode: departure.serviceJourney.line.publicCode ?? '',
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Linje">
            {lines.map((line) => (
                <TableRow key={line.key}>
                    <div
                        className={classes.line}
                        style={{
                            backgroundColor: `var(--table-transport-${
                                line.transportMode ?? 'unknown'
                            }-color)`,
                        }}
                    >
                        {line.publicCode}
                    </div>
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Line }
