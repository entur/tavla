import { formatTimestamp } from 'app/(root)/(admin)/utils/time'
import { Column } from './Column'

function LastModified({ timestamp }: { timestamp?: number }) {
    return <Column column="lastModified">{formatTimestamp(timestamp)}</Column>
}

export { LastModified }
