import { formatTimestamp } from 'Admin/utils/time'
import { SortableColumn } from './SortableColumn'

function LastModified({ timestamp }: { timestamp?: number }) {
    return (
        <SortableColumn column="lastModified">
            {formatTimestamp(timestamp)}
        </SortableColumn>
    )
}

export { LastModified }
