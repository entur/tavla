import { getDate, getRelativeTimeString, isDateStringToday } from 'utils/time'
import classes from '../styles.module.css'

function FormattedTime({ time }: { time: string }) {
    return (
        <>
            <div className="textRight weight600">
                {getRelativeTimeString(time)}
            </div>
            {!isDateStringToday(time) && (
                <div className={classes.departureDate}>{getDate(time)}</div>
            )}
        </>
    )
}

export { FormattedTime }
