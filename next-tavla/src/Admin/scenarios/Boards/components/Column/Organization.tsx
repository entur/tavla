import { TBoardID } from 'types/settings'
import { DraggableColumn } from './DraggableColumn'
import { useOrganizationName } from 'Admin/scenarios/Boards/hooks/useOrganizationName'

function Organization({ bid }: { bid?: TBoardID }) {
    const organizationName = useOrganizationName(bid)
    return (
        <DraggableColumn column="organization">
            {organizationName}
        </DraggableColumn>
    )
}

export { Organization }
