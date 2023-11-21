const SECOND = 1_000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 365 * DAY

const shortFormat = Intl.DateTimeFormat('no-NB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
}).format

const fullFormat = Intl.DateTimeFormat('no-NB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
}).format

export function formatTimestamp(millis?: number, asTimestamp = false) {
    if (!millis) return '-'

    const timeAgo = Date.now() - millis

    if (asTimestamp)
        return timeAgo < DAY ? shortFormat(millis) : fullFormat(millis)

    if (timeAgo > YEAR) return getTimeSince(timeAgo, YEAR)
    if (timeAgo > MONTH) return getTimeSince(timeAgo, MONTH)
    if (timeAgo > DAY) return getTimeSince(timeAgo, DAY)
    if (timeAgo > HOUR) return getTimeSince(timeAgo, HOUR)
    if (timeAgo > MINUTE) return getTimeSince(timeAgo, MINUTE)
    if (timeAgo > 10 * SECOND) return getTimeSince(timeAgo, SECOND)
    return 'nettopp'
}

function getTimeSince(timeAgo: number, divisor: number) {
    const count = Math.floor(timeAgo / divisor)
    const plural = count !== 1

    const timeText = {
        [SECOND]: plural ? 'sekunder' : 'sekund',
        [MINUTE]: plural ? 'minutter' : 'minutt',
        [HOUR]: plural ? 'timer' : 'time',
        [DAY]: plural ? 'dager' : 'dag',
        [MONTH]: plural ? 'måneder' : 'måned',
        [YEAR]: 'år',
    }

    return timeText[divisor]
        ? `${count} ${timeText[divisor]} siden`
        : 'en stund siden'
}
