import { BulletBadge } from '@entur/layout'
import { TOrganization, TUserID } from 'types/settings'
import { StyledColumn } from './StyledColumn'

function Role({
    organization,
    userId,
}: {
    organization: TOrganization
    userId: TUserID
}) {
    return (
        <StyledColumn>
            {organization.owners?.includes(userId) ? (
                <BulletBadge variant="success">Eier</BulletBadge>
            ) : (
                <BulletBadge variant="neutral">Medlem</BulletBadge>
            )}
        </StyledColumn>
    )
}

export { Role }
