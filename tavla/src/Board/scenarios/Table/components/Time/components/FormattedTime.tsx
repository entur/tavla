import { getDate, getRelativeTimeString, isDateStringToday } from 'utils/time'

function FormattedTime({ time }: { time: string }) {
    return (
        <>
            <div className="text-right text-em-xl font-semibold leading-em-base">
                {getRelativeTimeString(time)}
            </div>
            {!isDateStringToday(time) && (
                <div className="text-right text-em-sm">{getDate(time)}</div>
            )}
        </>
    )
}

export { FormattedTime }
