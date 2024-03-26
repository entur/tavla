import { Heading2, Paragraph } from '@entur/typography'
import { MemberList } from './MemberList'
import { TOrganizationID, TUser, TUserID } from 'types/settings'
import { InviteUser } from './InviteUser'

function MemberAdministration(props: {
    oid?: TOrganizationID
    uid?: TUserID
    members: TUser[]
}) {
    return (
        <div className="flexColumn g-2">
            <Heading2>Medlemmer</Heading2>
            <div className="box">
                <Paragraph>Administrer medlemmer i organisasjonen. </Paragraph>
                <InviteUser oid={props.oid} />
                <MemberList {...props} />
            </div>
        </div>
    )
}

export { MemberAdministration }
