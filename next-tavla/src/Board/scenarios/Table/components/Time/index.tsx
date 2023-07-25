import { useNonNullContext } from 'hooks/useNonNullContext'
import { formatDateString, getRelativeTimeString } from 'utils/time'
import { DepartureContext } from '../../contexts'

import classes from './styles.module.css'

function Time() {
    const departure = useNonNullContext(DepartureContext)
    const timeDeviation = Math.abs(
        (Date.parse(departure.aimedDepartureTime) -
            Date.parse(departure.expectedDepartureTime)) /
            1000,
    )
    if (timeDeviation > 120) {
        return (
            <td className={classes.timeContainer}>
                <div className={classes.expectedDepartureTime}>
                    {getRelativeTimeString(departure.expectedDepartureTime)}
                </div>
                <div className={classes.aimedDepartureTime}>
                    {formatDateString(departure.aimedDepartureTime)}
                </div>
            </td>
        )
    }
    return (
        <td className={classes.timeContainer}>
            <div>{getRelativeTimeString(departure.expectedDepartureTime)}</div>
        </td>
    )
}

export { Time }
