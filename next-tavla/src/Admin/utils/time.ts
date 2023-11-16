export function formatTimestamp(timestamp?: number, seconds = false) {
    if (!timestamp) return '-'

    const shortFormat = Intl.DateTimeFormat('no-NB', {
        hour: '2-digit',
        minute: '2-digit',
        second: seconds ? '2-digit' : undefined,
    })

    const fullFormat = Intl.DateTimeFormat('no-NB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    const dayThen = new Date(timestamp).toDateString()
    const dayNow = new Date().toDateString()
    const dayYesterday = new Date(Date.now() - 86_400_000).toDateString()

    if (dayThen === dayNow) return shortFormat.format(timestamp)

    if (dayThen === dayYesterday)
        return 'i går, ' + shortFormat.format(timestamp)

    return fullFormat.format(timestamp)
}
