import { BulletBadge } from '@entur/layout'
import { TOrganization, TUserID } from 'types/settings'
import { Cell } from './Cell'

function Role({
    organization,
    userId,
}: {
    organization: TOrganization
    userId: TUserID
}) {
    return (
        <Cell>
            {organization.owners?.includes(userId) ? (
                <BulletBadge variant="success">Eier</BulletBadge>
            ) : (
                <BulletBadge variant="neutral">Medlem</BulletBadge>
            )}
        </Cell>
    )
}

export { Role }
