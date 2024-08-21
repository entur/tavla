import { getDate, getRelativeTimeString, isDateStringToday } from 'utils/time'

function FormattedTime({ time }: { time: string }) {
    return (
        <>
            <div className="text-right font-semibold">
                {getRelativeTimeString(time)}
            </div>
            {!isDateStringToday(time) && (
                <div className="text-right text-em-xs">{getDate(time)}</div>
            )}
        </>
    )
}

export { FormattedTime }
