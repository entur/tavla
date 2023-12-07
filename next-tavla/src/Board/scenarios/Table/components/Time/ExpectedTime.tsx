import { useNonNullContext } from 'hooks/useNonNullContext'
import { formatDateString, getRelativeTimeString } from 'utils/time'
import classes from './styles.module.css'
import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import { FormattedTime } from './components/FormattedTime'

function ExpectedTime() {
    const departures = useNonNullContext(DeparturesContext)

    const time = departures.map((departure) => ({
        aimedDepartureTime: departure.aimedDepartureTime,
        expectedDepartureTime: departure.expectedDepartureTime,
        cancelled: departure.cancellation,
        key: `${departure.serviceJourney.id}_${departure.aimedDepartureTime}`,
    }))

    return (
        <TableColumn title="Forventet" className="textRight">
            {time.map((t) => (
                <TableRow key={t.key}>
                    <Time
                        expectedDepartureTime={t.expectedDepartureTime}
                        aimedDepartureTime={t.aimedDepartureTime}
                        cancelled={t.cancelled}
                    />
                </TableRow>
            ))}
        </TableColumn>
    )
}

function Time({
    expectedDepartureTime,
    aimedDepartureTime,
    cancelled,
}: {
    expectedDepartureTime: string
    aimedDepartureTime: string
    cancelled: boolean
}) {
    if (cancelled)
        return (
            <>
                <div className={classes.cancelled}>Innstilt</div>
                <div className={classes.aimedDepartureTime}>
                    {formatDateString(aimedDepartureTime)}
                </div>
            </>
        )

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

    return <FormattedTime time={expectedDepartureTime} />
}

export { ExpectedTime }
