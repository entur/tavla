import { formatTimestamp } from 'Admin/utils/time'
import { Column } from './Column'

function LastModified({ timestamp }: { timestamp?: number }) {
    return <Column column="lastModified">{formatTimestamp(timestamp)}</Column>
}

export { LastModified }
