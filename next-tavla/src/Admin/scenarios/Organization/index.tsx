import classes from './styles.module.css'
import { TOrganization, TUser } from 'types/settings'
import { UploadLogo } from './components/UploadLogo'
import { MemberAdministration } from './components/MemberAdministration'

function Organization({
    user,
    organization,
}: {
    user: TUser
    organization: TOrganization
}) {
    return (
        <div className={classes.organization}>
            <UploadLogo organization={organization} />
            <MemberAdministration uid={user.uid} oid={organization.id} />
        </div>
    )
}

export { Organization }
