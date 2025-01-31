import { TMeta } from 'types/meta'
import { TBoardID, TOrganization } from 'types/settings'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { Organization } from './Organization'
import { FontSelect } from './FontSelect'
import { Title } from './Title'
import { WalkingDistance } from './WalkingDistance'

function MetaSettings({
    bid,
    meta,
    organization,
}: {
    bid: TBoardID
    meta: TMeta
    organization?: TOrganization
}) {
    return (
        <>
            <Title bid={bid} title={meta?.title ?? DEFAULT_BOARD_NAME} />
            <Organization bid={bid} organization={organization} />
            <FontSelect bid={bid} font={meta?.fontSize ?? 'medium'} />
            <WalkingDistance bid={bid} location={meta?.location} />
        </>
    )
}

export { MetaSettings }
