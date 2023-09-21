import { formatDate } from 'utils/time'

function LastModified({ timestamp }: { timestamp?: number }) {
    return <div>{formatDate(new Date(timestamp ?? 0))}</div>
}

export { LastModified }
