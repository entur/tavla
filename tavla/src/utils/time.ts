const ONE_MINUTE = 60
const TEN_MINUTES = 600

export function getRelativeTimeString(dateString: string) {
    const timeDiffInSeconds = (Date.parse(dateString) - Date.now()) / 1000

    // Compensate to avoid optimistic time since fetch of departures happens every 30 seconds
    const adjustedTimeDiffInSeconds = timeDiffInSeconds - 15

    if (adjustedTimeDiffInSeconds < ONE_MINUTE) return 'Nå'
    else if (adjustedTimeDiffInSeconds < TEN_MINUTES)
        return Math.floor(adjustedTimeDiffInSeconds / ONE_MINUTE) + ' min'
    return formatDateString(dateString)
}

export function formatDateString(dateString: string) {
    return formatTimeStamp(Date.parse(dateString))
}

export function formatTimeStamp(timestamp: number) {
    return Intl.DateTimeFormat('no-NB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Oslo',
    }).format(timestamp)
}

export function formatDateToISO(date: Date) {
    const isoString = date.toISOString()
    const isoFormat = isoString.replace(/\.\d{3}Z$/, 'Z')
    return isoFormat
}

export function addMinutesToDate(date: Date, minutesToAdd: number) {
    return new Date(date.setMinutes(date.getMinutes() + minutesToAdd))
}

export function getDate(dateString: string) {
    return Intl.DateTimeFormat('no-NB', {
        month: 'short',
        day: '2-digit',
        timeZone: 'Europe/Oslo',
    }).format(Date.parse(dateString))
}

export function isDateStringToday(dateString: string) {
    const today = new Date().setHours(0, 0, 0, 0)
    const timestampDay = new Date(Date.parse(dateString)).setHours(0, 0, 0, 0)
    return today === timestampDay
}
