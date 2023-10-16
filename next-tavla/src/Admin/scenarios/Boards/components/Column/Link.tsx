import { useLink } from '../../hooks/useLink'
import { DraggableColumn } from './DraggableColumn'

function Link({ bid }: { bid?: string }) {
    const link = useLink(bid)

    return <DraggableColumn column="url">{link}</DraggableColumn>
}
export { Link }
