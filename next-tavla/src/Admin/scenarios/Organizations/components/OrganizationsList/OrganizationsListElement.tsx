import { TOrganization, TUserID } from 'types/settings'
import classes from './styles.module.css'
import { BulletBadge } from '@entur/layout'

function OrganizationsListElement({
    organization,
    userId,
}: {
    organization: TOrganization
    userId: TUserID
}) {
    return (
        <div className={classes.listElement}>
            {organization.name}
            <div className="w-30">
                {organization.owners?.includes(userId) ? (
                    <BulletBadge variant="success">Eier</BulletBadge>
                ) : (
                    <BulletBadge variant="neutral">Medlem</BulletBadge>
                )}
            </div>
        </div>
    )
}

export { OrganizationsListElement }
