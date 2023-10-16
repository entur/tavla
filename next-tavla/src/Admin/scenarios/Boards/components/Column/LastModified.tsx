import { formatTimestamp } from 'Admin/utils/time'
import { DraggableColumn } from './DraggableColumn'

function LastModified({ timestamp }: { timestamp?: number }) {
    return (
        <DraggableColumn column="lastModified">
            {formatTimestamp(timestamp)}
        </DraggableColumn>
    )
}

export { LastModified }
