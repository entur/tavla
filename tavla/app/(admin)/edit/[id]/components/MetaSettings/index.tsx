import { TMeta } from 'types/meta'
import { TBoardID, TOrganization } from 'types/settings'
import { Address } from './Adress'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { Organization } from './Organization'
import { FontSelect } from './FontSelect'
import { Title } from './Title'

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
            <Address bid={bid} location={meta?.location} />
            <FontSelect bid={bid} font={meta?.fontSize ?? 'medium'} />
            <Organization bid={bid} organization={organization} />
        </>
    )
}

export { MetaSettings }
