import { formatDateString, getRelativeTimeString } from 'utils/time'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'

function TimeColumn({
    time,
}: {
    time: {
        expectedDepartureTime: string
        aimedDepartureTime: string
        key: string
    }[]
}) {
    return (
        <TableColumn title="Avgang">
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
        <div className={classes.time}>
            {getRelativeTimeString(expectedDepartureTime)}
        </div>
    )
}

export { TimeColumn as Time }
