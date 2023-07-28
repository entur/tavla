import { formatDateString, getRelativeTimeString } from 'utils/time'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'
import classes from './styles.module.css'

function Time({
    time,
}: {
    time: {
        expectedDepartureTime: string
        aimedDepartureTime: string
        key: string
    }[]
}) {
    const Time = ({
        expectedDepartureTime,
        aimedDepartureTime,
    }: {
        expectedDepartureTime: string
        aimedDepartureTime: string
    }) => {
        const timeDeviation = Math.abs(
            (Date.parse(aimedDepartureTime) -
                Date.parse(expectedDepartureTime)) /
                1000,
        )
        if (timeDeviation > 120) {
            return (
                <div>
                    <div className={classes.expectedDepartureTime}>
                        {getRelativeTimeString(expectedDepartureTime)}
                    </div>
                    <div className={classes.aimedDepartureTime}>
                        {formatDateString(aimedDepartureTime)}
                    </div>
                </div>
            )
        }
        return (
            <div style={{ fontWeight: 600 }}>
                {getRelativeTimeString(expectedDepartureTime)}
            </div>
        )
    }

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

export { Time }
