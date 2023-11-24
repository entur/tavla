import { useNonNullContext } from 'hooks/useNonNullContext'
import {
    formatDateString,
    getDate,
    getRelativeTimeString,
    isDateStringToday,
} from 'utils/time'
import classes from './styles.module.css'
import { DeparturesContext } from 'Board/scenarios/Table/contexts'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'

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

    const isDepartureToday = isDateStringToday(expectedDepartureTime)

    return (
        <>
            <div className="textRight weight600">
                {getRelativeTimeString(expectedDepartureTime)}
            </div>
            {!isDepartureToday && (
                <div className={classes.departureDate}>
                    {getDate(expectedDepartureTime)}
                </div>
            )}
        </>
    )
}

export { ExpectedTime }
