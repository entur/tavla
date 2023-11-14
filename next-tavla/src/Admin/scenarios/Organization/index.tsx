import classes from './styles.module.css'
import { TOrganization, TUser } from 'types/settings'
import { UploadLogo } from './components/UploadLogo'
import { MemberAdministration } from './components/MemberAdministration'
import { Heading1 } from '@entur/typography'
import { Contrast } from 'Admin/components/Contrast'
import { DeleteOrganization } from './components/DeleteOrganization'

function Organization({
    user,
    organization,
}: {
    user: TUser
    organization: TOrganization
}) {
    return (
        <div>
            <Contrast>
                <Heading1>{organization.name}</Heading1>
            </Contrast>
            <div className={classes.organization}>
                <UploadLogo organization={organization} />
                <MemberAdministration uid={user.uid} oid={organization.id} />
            </div>
            <DeleteOrganization organization={organization} />
        </div>
    )
}

export { Organization }
