export function getRelativeTimeString(dateString: string) {
    const timeDiff = Date.parse(dateString) - Date.now()

    if (timeDiff < 60_000) return 'Nå'
    else if (timeDiff < 600_000) return Math.floor(timeDiff / 60_000) + ' min'
    else if (!isDateStringToday(dateString))
        return formatDateString(dateString, true)
    return formatDateString(dateString)
}

export function formatDateString(dateString: string, date = false) {
    return Intl.DateTimeFormat('no-NB', {
        hour12: false,
        day: date ? '2-digit' : undefined,
        month: date ? 'short' : undefined,
        hour: '2-digit',
        minute: '2-digit',
    })
        .format(Date.parse(dateString))
        .replace(',', '')
}

export function formatTimeStamp(timestamp: number) {
    return Intl.DateTimeFormat('no-NB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    }).format(timestamp)
}

export function formatDate(date: Date) {
    return date
        .toLocaleDateString('no-NB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        .replace(',', '')
}

export function isTimestampToday(timestamp: number) {
    const today = new Date().setHours(0, 0, 0, 0)
    const timestampDay = new Date(timestamp).setHours(0, 0, 0, 0)
    return today === timestampDay
}

export function isDateStringToday(dateString: string) {
    const today = new Date().setHours(0, 0, 0, 0)
    const timestampDay = new Date(Date.parse(dateString)).setHours(0, 0, 0, 0)
    return today === timestampDay
}
