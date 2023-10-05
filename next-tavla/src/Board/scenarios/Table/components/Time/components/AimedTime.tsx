import { useNonNullContext } from 'hooks/useNonNullContext'
import { formatDateString } from 'utils/time'
import classes from './styles.module.css'
import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { TableColumn } from '../../TableColumn'
import { TableRow } from '../../TableRow'

function TimeColumn() {
    const departures = useNonNullContext(DeparturesContext)

    const time = departures.map((departure) => ({
        aimedDepartureTime: departure.aimedDepartureTime,
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Planlagt" className={classes.header}>
            {time.map((t) => (
                <TableRow key={t.key}>
                    <Time aimedDepartureTime={t.aimedDepartureTime} />
                </TableRow>
            ))}
        </TableColumn>
    )
}

function Time({ aimedDepartureTime }: { aimedDepartureTime: string }) {
    return (
        <div className={classes.time}>
            {formatDateString(aimedDepartureTime)}
        </div>
    )
}

export { TimeColumn as AimedTime }
