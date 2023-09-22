import { formatTimestamp } from 'Admin/utils/time'

function LastModified({ timestamp }: { timestamp?: number }) {
    return <div>{formatTimestamp(timestamp)}</div>
}

export { LastModified }
