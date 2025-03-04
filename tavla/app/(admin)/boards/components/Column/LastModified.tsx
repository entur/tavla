import { formatTimestamp } from 'app/(admin)/utils/time'
import { Column } from './Column'

function LastModified({ timestamp }: { timestamp?: number }) {
    return (
        <Column column="lastModified">
            {timestamp ? formatTimestamp(timestamp) : '-'}
        </Column>
    )
}

export { LastModified }
