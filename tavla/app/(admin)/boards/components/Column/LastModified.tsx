import { formatTimestamp } from 'app/(admin)/utils/time'
import { ColumnWrapper } from './ColumnWrapper'

function LastModified({ timestamp }: { timestamp?: number }) {
    return (
        <ColumnWrapper column="lastModified">
            {timestamp ? formatTimestamp(timestamp) : '-'}
        </ColumnWrapper>
    )
}

export { LastModified }
