export function formatTimestamp(timestamp?: number) {
    if (!timestamp) return '-'
    return Intl.DateTimeFormat('no-NB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(timestamp)
}
