import { BulletBadge } from '@entur/layout'
import { TOrganization, TUserID } from 'types/settings'

function Role({
    organization,
    userId,
}: {
    organization: TOrganization
    userId: TUserID
}) {
    return (
        <div>
            {organization.owners?.includes(userId) ? (
                <BulletBadge variant="success">Eier</BulletBadge>
            ) : (
                <BulletBadge variant="neutral">Medlem</BulletBadge>
            )}
        </div>
    )
}

export { Role }
