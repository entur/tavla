import classes from './styles.module.css'
import { TOrganization, TUser } from 'types/settings'
import { UploadLogo } from './components/UploadLogo'
import { MemberAdministration } from './components/MemberAdministration'
import { Heading1 } from '@entur/typography'

function Organization({
    user,
    organization,
}: {
    user: TUser
    organization: TOrganization
}) {
    return (
        <div>
            <Heading1>{organization.name}</Heading1>
            <div className={classes.organization}>
                <UploadLogo organization={organization} />
                <MemberAdministration uid={user.uid} oid={organization.id} />
            </div>
        </div>
    )
}

export { Organization }
