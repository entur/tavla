import { Heading2, Paragraph } from '@entur/typography'
import { MemberList } from './MemberList'
import { TOrganizationID, TUser, TUserID } from 'types/settings'
import { InviteUser } from './InviteUser'
import { Contrast } from 'Admin/components/Contrast'

function MemberAdministration(props: {
    oid?: TOrganizationID
    uid?: TUserID
    members: TUser[]
}) {
    return (
        <Contrast className="flexColumn g-2">
            <Heading2>Medlemmer</Heading2>
            <div className="box">
                <Paragraph>Administrer medlemmer i organisasjonen. </Paragraph>
                <InviteUser oid={props.oid} />
                <MemberList {...props} />
            </div>
        </Contrast>
    )
}

export { MemberAdministration }
