import { useLink } from '../../hooks/useLink'
import { SortableColumn } from './SortableColumn'

function Link({ bid }: { bid?: string }) {
    const link = useLink(bid)

    return <SortableColumn column="url">{link}</SortableColumn>
}
export { Link }
