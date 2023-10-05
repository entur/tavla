import { useNonNullContext } from 'hooks/useNonNullContext'
import { formatDateString, getRelativeTimeString } from 'utils/time'
import classes from './styles.module.css'
import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { TableColumn } from '../../TableColumn'
import { TableRow } from '../../TableRow'

function ExpectedTimeColumn() {
    const departures = useNonNullContext(DeparturesContext)

    const time = departures.map((departure) => ({
        aimedDepartureTime: departure.aimedDepartureTime,
        expectedDepartureTime: departure.expectedDepartureTime,
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Forventet" className="textRight">
            {time.map((t) => (
                <TableRow key={t.key}>
                    <Time
                        expectedDepartureTime={t.expectedDepartureTime}
                        aimedDepartureTime={t.aimedDepartureTime}
                    />
                </TableRow>
            ))}
        </TableColumn>
    )
}

function Time({
    expectedDepartureTime,
    aimedDepartureTime,
}: {
    expectedDepartureTime: string
    aimedDepartureTime: string
}) {
    const timeDeviation = Math.abs(
        (Date.parse(aimedDepartureTime) - Date.parse(expectedDepartureTime)) /
            1000,
    )
    if (timeDeviation > 120) {
        return (
            <>
                <div className={classes.expectedDepartureTime}>
                    {getRelativeTimeString(expectedDepartureTime)}
                </div>
                <div className={classes.aimedDepartureTime}>
                    {formatDateString(aimedDepartureTime)}
                </div>
            </>
        )
    }
    return (
        <div className="textRight weight600">
            {getRelativeTimeString(expectedDepartureTime)}
        </div>
    )
}

export { ExpectedTimeColumn as ExpectedTime }
