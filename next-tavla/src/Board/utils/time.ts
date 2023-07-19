export function getRelativeTimeString(dateString: string) {
    const timeDiff = Date.parse(dateString) - Date.now()
    if (timeDiff < 60_000) return 'Nå'
    else if (timeDiff < 900_000) return Math.floor(timeDiff / 60_000) + ' min'
    else return formatDateString(dateString)
}

export function formatDateString(dateString: string) {
    return Intl.DateTimeFormat('no-NB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    }).format(Date.parse(dateString))
}

export function formatTimeStamp(timestamp: number) {
    return Intl.DateTimeFormat('no-NB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    }).format(timestamp)
}
