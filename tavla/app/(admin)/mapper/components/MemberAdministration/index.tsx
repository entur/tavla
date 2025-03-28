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
        <div className="box flex flex-col gap-1">
            <Heading2>Medlemmer</Heading2>
            <Paragraph>
                Administrer medlemmer i mappen. Du kan kun legge til medlemmer
                som har opprettet en Tavla-bruker.
            </Paragraph>
            <InviteUser oid={props.oid} />
            <MemberList {...props} />
        </div>
    )
}

export { MemberAdministration }
