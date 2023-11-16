'use client'
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
            <div className="flexRow justifyBetween alignCenter">
                <Contrast>
                    <Heading1>{organization.name}</Heading1>
                </Contrast>
                <DeleteOrganization
                    organization={organization}
                    uid={user.uid}
                />
            </div>
            <div className={classes.organization}>
                <UploadLogo organization={organization} />
                <MemberAdministration uid={user.uid} oid={organization.id} />
            </div>
        </div>
    )
}

export { Organization }
