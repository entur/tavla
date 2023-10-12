export function formatTimestamp(timestamp?: number, seconds = false) {
    if (!timestamp) return '-'

    const timeDiff = Date.now() - timestamp

    if (timeDiff < 86_400_000)
        return Intl.DateTimeFormat('no-NB', {
            hour: '2-digit',
            minute: '2-digit',
            second: seconds ? '2-digit' : undefined,
        }).format(timestamp)

    return Intl.DateTimeFormat('no-NB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(timestamp)
}
